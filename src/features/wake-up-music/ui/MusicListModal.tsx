"use no memo";
"use client";

import { useState } from "react";
import { MusicListItem } from "@/entities/music/ui/MusicListItem";
import type { DormitoryMusic } from "@/entities/dormitory/model/dormitory";
import { extractYoutubeVideoId } from "@/entities/music/lib/youtube";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { MusicFilterDropdown } from "@/features/wake-up-music/ui/MusicFilterDropdown";
import type { WakeUpMusicSort } from "@/features/wake-up-music/model/useMusicFilter";
import type {
  AiAnalysisController,
  AnalysisStage,
} from "@/features/wake-up-music-analysis/model/useWakeUpMusicAiAnalysis";
import { AiSongThumbnailLoading } from "@/features/wake-up-music-analysis/ui/AiSongThumbnailLoading";
import { AiRatingBadge } from "@/features/wake-up-music-analysis/ui/AiRatingBadge";
import { MusicPlayerPanel } from "@/features/wake-up-music-analysis/ui/MusicPlayerPanel";
import Sidebar from "@/shared/asset/svg/Sidebar";

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
  const [selectedMusicId, setSelectedMusicId] = useState<number | null>(
    () => songs[0]?.id ?? null,
  );
  const [seekStart, setSeekStart] = useState(0);
  const [seekAutoplay, setSeekAutoplay] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  if (!isOpen) return null;

  const selectedIndex = songs.findIndex((song) => song.id === selectedMusicId);
  const resolvedIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const showAi = canUseAiAnalysis && Boolean(aiAnalysis);
  const selectedSong = songs[resolvedIndex];
  const selectedVideoId = selectedSong
    ? extractYoutubeVideoId(selectedSong.videoUrl ?? selectedSong.musicUrl)
    : null;
  const selectedAiState = selectedVideoId
    ? aiAnalysis?.songStates[selectedVideoId]
    : undefined;
  const selectedTitle = selectedSong?.title ?? selectedSong?.musicUrl ?? "";

  // 타임스탬프 클릭만 자동재생, 곡 선택·이동·열기는 0에서 정지
  const handleSeek = (seconds: number) => {
    setSeekStart(seconds);
    setSeekAutoplay(true);
  };

  const goToSong = (musicId: number) => {
    setSelectedMusicId(musicId);
    setSeekStart(0);
    setSeekAutoplay(false);
    setIsPlayerOpen(true);
  };

  const togglePlayer = () => {
    if (!isPlayerOpen) setSeekAutoplay(false);
    setIsPlayerOpen((prev) => !prev);
  };

  const goPrev = () => {
    if (resolvedIndex > 0) {
      setSelectedMusicId(songs[resolvedIndex - 1].id);
      setSeekStart(0);
      setSeekAutoplay(false);
    }
  };

  const goNext = () => {
    if (resolvedIndex < songs.length - 1) {
      setSelectedMusicId(songs[resolvedIndex + 1].id);
      setSeekStart(0);
      setSeekAutoplay(false);
    }
  };

  return (
    <div
      className="bg-background/50 fixed inset-0 z-50 flex cursor-default items-center justify-center overflow-y-auto px-5 py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-background-surface mx-auto flex h-[calc(100vh-120px)] w-full max-w-[1400px] flex-col gap-6 overflow-hidden rounded-3xl p-8 shadow-[0_16px_80px_rgba(0,0,0,0.18)] sm:my-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            {songs.length > 0 && (
              <button
                type="button"
                onClick={togglePlayer}
                className="border-sub-4 bg-background hover:bg-sub-4 mt-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors"
                aria-label={isPlayerOpen ? "플레이어 닫기" : "플레이어 열기"}
              >
                <Sidebar isActive={isPlayerOpen} size={16} />
              </button>
            )}
            <div className="min-w-0">
              <span className="text-main-text text-text-1 font-semibold">
                기상음악 신청 목록
              </span>
              <div className="text-sub-1 text-caption-1 mt-1">
                현재 {songs.length}개의 신청 곡을 한꺼번에 확인할 수 있습니다.
              </div>
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

        <div className="border-sub-4 bg-background flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border p-6 shadow-inner">
          {songs.length === 0 ? (
            <div className="text-sub-1 text-caption-1 py-16 text-center">
              신청된 음악이 없습니다.
            </div>
          ) : (
            <div
              className={`flex min-h-0 min-w-0 flex-1 ${
                isPlayerOpen ? "flex-col gap-6 lg:flex-row" : "flex-col"
              }`}
            >
              {isPlayerOpen && (
                <MusicPlayerPanel
                  videoId={selectedVideoId}
                  start={seekStart}
                  autoPlay={seekAutoplay}
                  title={selectedTitle}
                  canPrev={resolvedIndex > 0}
                  canNext={resolvedIndex < songs.length - 1}
                  onPrev={goPrev}
                  onNext={goNext}
                  showAi={showAi}
                  aiState={selectedAiState}
                  onSeek={handleSeek}
                />
              )}

              <aside className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="border-sub-4 min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl border">
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
                        isSelected={
                          selectedIndex >= 0 && music.id === selectedMusicId
                        }
                        onSelect={() => goToSong(music.id)}
                        aiStatus={
                          showAi && aiState ? (
                            <AiRatingBadge state={aiState} />
                          ) : undefined
                        }
                        thumbnailOverlay={
                          showAi &&
                          (aiState?.status === "transcript" ||
                            aiState?.status === "analyzing") ? (
                            <AiSongThumbnailLoading variant={aiState.status} />
                          ) : undefined
                        }
                        onToggleLike={() => onToggleLike(music)}
                        isLikePending={
                          likeMutation.isPending &&
                          likeMutation.variables?.id === music.id
                        }
                        onDelete={
                          meId && (meId === music.userId || canDeleteAnyMusic)
                            ? () => onDelete(music.id)
                            : undefined
                        }
                        isDeletePending={
                          cancelMutation.isPending &&
                          cancelMutation.variables === music.id
                        }
                      />
                    );
                  })}
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
