"use no memo";
"use client";

import { useState } from "react";
import { MusicListItem } from "@/entities/music/ui/MusicListItem";
import { YoutubeEmbed } from "@/entities/music/ui/YoutubeEmbed";
import type { DormitoryMusic } from "@/entities/dormitory/model/dormitory";
import { extractYoutubeVideoId } from "@/entities/music/lib/youtube";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { MusicFilterDropdown } from "@/features/wake-up-music/ui/MusicFilterDropdown";
import type { WakeUpMusicSort } from "@/features/wake-up-music/model/useMusicFilter";
import type {
  AiAnalysisController,
  AnalysisStage,
} from "@/features/wake-up-music/model/useWakeUpMusicAiAnalysis";
import { AiSongStatus } from "@/features/wake-up-music/ui/AiSongStatus";
import { AiSongThumbnailLoading } from "@/features/wake-up-music/ui/AiSongThumbnailLoading";

const AI_BUTTON_LABELS = {
  idle: "AI 분석",
  transcript: "자막 수집 중…",
  model: "모델 로드",
  analyze: "분석 중…",
} as const satisfies Record<AnalysisStage, string>;

interface MusicListModalProps {
  isOpen: boolean;
  songs: DormitoryMusic[];
  meId?: number | null;
  canDeleteAnyMusic?: boolean;
  canUseAiAnalysis?: boolean;
  aiAnalysis?: AiAnalysisController;
  sort: WakeUpMusicSort;
  onSortChange: (sort: WakeUpMusicSort) => void;
  filterButtonLabel: string;
  hasFilter: boolean;
  onClose: () => void;
  onToggleLike: (music: DormitoryMusic) => void;
  onDelete: (musicId: number) => void;
  likeMutation: {
    isPending: boolean;
    variables?: { id: number } | null;
  };
  cancelMutation: {
    isPending: boolean;
    variables?: string | number | null;
  };
}

export function MusicListModal({
  isOpen,
  songs,
  meId,
  canDeleteAnyMusic = false,
  canUseAiAnalysis = false,
  aiAnalysis,
  sort,
  onSortChange,
  filterButtonLabel,
  hasFilter,
  onClose,
  onToggleLike,
  onDelete,
  likeMutation,
  cancelMutation,
}: MusicListModalProps) {
  const [player, setPlayer] = useState<{
    videoId: string;
    start: number;
  } | null>(null);

  if (!isOpen) return null;

  const showAi = canUseAiAnalysis && Boolean(aiAnalysis);

  return (
    <div
      className="bg-background/50 fixed inset-0 z-50 flex cursor-default items-center justify-center overflow-y-auto px-5 py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-background-surface mx-auto flex max-h-[calc(100vh-120px)] w-full max-w-[1400px] flex-col gap-6 overflow-y-auto rounded-3xl p-8 shadow-[0_16px_80px_rgba(0,0,0,0.18)] sm:my-6"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-main-text text-text-1 font-semibold">
              기상음악 신청 목록
            </span>
            <div className="text-sub-1 text-caption-1 mt-1">
              현재 {songs.length}개의 신청 곡을 한꺼번에 확인할 수 있습니다.
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showAi && aiAnalysis && (
              <TextButton
                variant={aiAnalysis.isAnalyzing ? "disabled" : "filled"}
                size="fit"
                onClick={aiAnalysis.handleAnalyze}
                disabled={aiAnalysis.isAnalyzing}
              >
                {aiAnalysis.stage === "model"
                  ? `${AI_BUTTON_LABELS.model} ${Math.round(aiAnalysis.modelProgress * 100)}%`
                  : AI_BUTTON_LABELS[aiAnalysis.stage]}
              </TextButton>
            )}
            <MusicFilterDropdown
              sort={sort}
              onSortChange={onSortChange}
              currentFilterLabel={filterButtonLabel}
              hasFilter={hasFilter}
            />
            <button
              type="button"
              onClick={onClose}
              className="text-sub-1 text-caption-2 hover:text-p-1 cursor-pointer transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

        {/* 플레이어 */}
        {player && (
          <div className="flex flex-col gap-2">
            <div className="w-full">
              <YoutubeEmbed videoId={player.videoId} start={player.start} />
            </div>
            <button
              type="button"
              onClick={() => setPlayer(null)}
              className="text-sub-1 text-caption-2 hover:text-p-1 cursor-pointer self-start"
            >
              플레이어 닫기
            </button>
          </div>
        )}

        {/* 신청 음악 목록 */}
        <div className="border-sub-4 bg-background flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border p-6 shadow-inner">
          {songs.length === 0 ? (
            <div className="text-sub-1 text-caption-1 py-16 text-center">
              신청된 음악이 없습니다.
            </div>
          ) : (
            <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
              {songs.map((music) => {
                const videoId = extractYoutubeVideoId(
                  music.videoUrl ?? music.musicUrl,
                );
                const aiState = videoId
                  ? aiAnalysis?.songStates[videoId]
                  : undefined;

                return (
                  <MusicListItem
                    key={music.id}
                    music={music}
                    isLikePending={
                      likeMutation.isPending &&
                      likeMutation.variables?.id === music.id
                    }
                    onToggleLike={() => onToggleLike(music)}
                    onDelete={
                      meId && (meId === music.userId || canDeleteAnyMusic)
                        ? () => onDelete(music.id)
                        : undefined
                    }
                    isDeletePending={
                      cancelMutation.isPending &&
                      cancelMutation.variables === music.id
                    }
                    thumbnailOverlay={
                      showAi &&
                      (aiState?.status === "transcript" ||
                        aiState?.status === "analyzing") ? (
                        <AiSongThumbnailLoading variant={aiState.status} />
                      ) : undefined
                    }
                    aiStatus={
                      showAi && aiState ? (
                        <AiSongStatus
                          state={aiState}
                          onSeek={
                            videoId
                              ? (seconds) =>
                                  setPlayer({ videoId, start: seconds })
                              : undefined
                          }
                        />
                      ) : undefined
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
