"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Music } from "@/entities/music/model/music";
import { extractYoutubeVideoId } from "@/entities/music/lib/youtube";
import { youtubeQueries } from "@/entities/music/api/youtubeQueries";
import { getMusicLlmEngine } from "@/entities/ai/lib/webllmEngine";
import {
  buildSongAnalysisMessages,
  parseSongAnalysis,
  SONG_ANALYSIS_SCHEMA,
  type SongAnalysis,
} from "@/features/wake-up-music-analysis/lib/songAnalysis";
import {
  cacheAnalysis,
  cacheTranscript,
  getCachedAnalysis,
  getCachedTranscript,
} from "@/features/wake-up-music-analysis/lib/analysisCache";

const MAX_ANALYSIS_SONGS = 20;

export type AnalysisStage = "idle" | "transcript" | "model" | "analyze";

export type AiSongState =
  | { status: "transcript" }
  | { status: "analyzing" }
  | { status: "analyzed"; analysis: SongAnalysis }
  | { status: "error"; message: string };

export interface AiAnalysisController {
  stage: AnalysisStage;
  isAnalyzing: boolean;
  modelProgress: number;
  songStates: Record<string, AiSongState>;
  handleAnalyze: () => void;
  loadCachedAnalyses: () => void;
}

export function useWakeUpMusicAiAnalysis(songs: Music[]): AiAnalysisController {
  const queryClient = useQueryClient();
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [modelProgress, setModelProgress] = useState(0);
  const [songStates, setSongStates] = useState<Record<string, AiSongState>>({});

  const isAnalyzing = stage !== "idle";

  const setSongState = (videoId: string, state: AiSongState) => {
    setSongStates((prev) => ({ ...prev, [videoId]: state }));
  };

  const loadCachedAnalyses = async () => {
    const ids: string[] = [];
    for (const music of songs) {
      const id = extractYoutubeVideoId(music.videoUrl ?? music.musicUrl);
      if (id) ids.push(id);
    }

    const analyses = await Promise.all(ids.map((id) => getCachedAnalysis(id)));
    setSongStates((prev) => {
      const next = { ...prev };
      ids.forEach((id, index) => {
        const analysis = analyses[index];
        if (analysis && !next[id]) {
          next[id] = { status: "analyzed", analysis };
        }
      });
      return next;
    });
  };

  const handleAnalyze = async () => {
    if (isAnalyzing) return;

    const targets: { videoId: string; title: string }[] = [];
    for (const music of songs) {
      if (targets.length >= MAX_ANALYSIS_SONGS) break;
      const videoId = extractYoutubeVideoId(music.videoUrl ?? music.musicUrl);
      if (videoId) {
        targets.push({ videoId, title: music.title ?? music.musicUrl });
      }
    }

    if (targets.length === 0) {
      toast.error("분석할 음악이 없습니다.");
      return;
    }

    try {
      setStage("transcript");
      setModelProgress(0);

      // 분석 캐시가 있으면 즉시 복원하고, 나머지만 새로 분석한다.
      const cachedAnalyses = await Promise.all(
        targets.map((target) => getCachedAnalysis(target.videoId)),
      );
      let analyzedCount = 0;
      const pending: typeof targets = [];
      const initialStates: Record<string, AiSongState> = {};
      targets.forEach((target, index) => {
        const cached = cachedAnalyses[index];
        if (cached) {
          initialStates[target.videoId] = {
            status: "analyzed",
            analysis: cached,
          };
          analyzedCount += 1;
        } else {
          initialStates[target.videoId] = { status: "transcript" };
          pending.push(target);
        }
      });
      setSongStates(initialStates);

      // 전부 캐시 적중 → 자막·모델 로드 없이 끝
      if (pending.length === 0) {
        setStage("idle");
        toast.success(`${analyzedCount}곡 AI 분석 완료`);
        return;
      }

      // 1) 자막 수집: 캐시 → 네트워크 순
      const collected = await Promise.all(
        pending.map(async (target) => {
          try {
            let text = await getCachedTranscript(target.videoId);
            if (text === null) {
              const transcript = await queryClient.fetchQuery(
                youtubeQueries.transcript(target.videoId),
              );
              text = transcript.text;
              await cacheTranscript(target.videoId, text);
            }
            setSongState(target.videoId, { status: "analyzing" });
            return { ...target, text };
          } catch {
            setSongState(target.videoId, {
              status: "error",
              message: "가사를 가져오지 못했습니다",
            });
            return null;
          }
        }),
      );

      const withTranscript = collected.filter((item) => item !== null);

      if (withTranscript.length === 0) {
        setStage("idle");
        if (analyzedCount > 0) {
          toast.success(`${analyzedCount}곡 AI 분석 완료`);
        } else {
          toast.error("자막을 가져오지 못해 분석을 진행할 수 없습니다.");
        }
        return;
      }

      // 2) 모델 로드
      setStage("model");
      const engine = await getMusicLlmEngine((report) =>
        setModelProgress(report.progress),
      );

      // 3) 분석 후 결과 캐시
      setStage("analyze");
      for (const item of withTranscript) {
        try {
          const completion = await engine.chat.completions.create({
            messages: buildSongAnalysisMessages(item.title, item.text),
            response_format: {
              type: "json_object",
              schema: SONG_ANALYSIS_SCHEMA,
            },
            temperature: 0.3,
          });
          const analysis = parseSongAnalysis(
            completion.choices[0]?.message?.content ?? "",
          );
          setSongState(item.videoId, { status: "analyzed", analysis });
          await cacheAnalysis(item.videoId, analysis);
          analyzedCount += 1;
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          setSongState(item.videoId, {
            status: "error",
            message: `AI 분석에 실패했습니다 (${reason.slice(0, 80)})`,
          });
        }
      }

      setStage("idle");
      toast.success(`${analyzedCount}곡 AI 분석 완료`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      toast.error(
        reason.includes("WebGPU")
          ? "이 브라우저/기기에서 WebGPU를 사용할 수 없습니다."
          : "AI 분석 중 오류가 발생했습니다.",
      );
      setStage("idle");
    }
  };

  return {
    stage,
    isAnalyzing,
    modelProgress,
    songStates,
    handleAnalyze,
    loadCachedAnalyses,
  };
}
