"use client";

import SmallStar from "@/shared/asset/svg/SmallStar";
import Cancel from "@/shared/asset/svg/Cancel";
import MusicRecommendCard from "@/features/wake-up-music-recommend/ui/MusicRecommendCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import RetryButton from "@/shared/ui/Button/RetryButton";
import { useAiMusicRecommend } from "@/features/wake-up-music-recommend/model/useAiMusicRecommend";
import { NoteText } from "@/shared/ui/NoteText";
import { MusicRecommendLoading } from "@/features/wake-up-music-recommend/ui/MusicRecommendLoading";

interface MusicRecommendModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUrl: string) => Promise<void> | void;
}

interface MusicRecommendEmptyProps {
  reason: "NO_HISTORY" | "NO_RECOMMENDATIONS" | null;
}

function MusicRecommendEmpty({ reason }: MusicRecommendEmptyProps) {
  const message =
    reason === "NO_HISTORY"
      ? "이전에 신청한 노래가 없습니다."
      : "추천된 노래가 없습니다.";
  const description =
    reason === "NO_HISTORY"
      ? "노래를 신청한 뒤 AI 추천을 사용할 수 있어요."
      : "다시 시도 버튼으로 새 추천을 요청해주세요.";

  return (
    <div className="border-sub-3 bg-background flex min-h-[230px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4">
      <SmallStar />
      <p className="text-text-2 text-main-text">{message}</p>
      <p className="text-text-3 text-sub-1">{description}</p>
    </div>
  );
}

export function MusicRecommendModal({
  open,
  onClose,
  onSubmit,
}: MusicRecommendModalProps) {
  const {
    displayCards,
    emptyReason,
    selectedUrl,
    retryCount,
    maxRetry,
    isActive,
    isPending,
    loadingStage,
    handleSelect,
    handleRetry,
  } = useAiMusicRecommend();

  if (!open) return null;

  const handleSubmit = async () => {
    if (!selectedUrl) return;

    try {
      await onSubmit(selectedUrl);
      onClose();
    } catch {
      return;
    }
  };

  return (
    <div
      className="bg-background/40 fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-background-surface flex min-h-[447px] w-[90%] max-w-[1152px] flex-col gap-6 rounded-2xl p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <SmallStar />
              <span className="text-main-text text-text-1">
                오늘의 노래 추천
              </span>
            </div>

            <button onClick={onClose} className="cursor-pointer">
              <Cancel />
            </button>
          </div>
          <NoteText>
            ※ 노래 추천은 이전에 신청한 곡을 기반으로 노래를 추천해요
          </NoteText>
        </div>

        <div className="scrollbar-hide flex min-h-[230px] gap-3 overflow-x-auto">
          {isPending ? (
            <MusicRecommendLoading stage={loadingStage ?? "recommend"} />
          ) : displayCards.length === 0 ? (
            <MusicRecommendEmpty reason={emptyReason} />
          ) : (
            displayCards.map((card) => (
              <MusicRecommendCard
                key={card.url}
                title={card.title}
                thumbnailUrl={card.thumbnailUrl}
                durationText={card.durationText}
                checked={selectedUrl === card.url}
                onChange={() => handleSelect(card.url)}
              />
            ))
          )}
        </div>

        <div className="flex justify-end gap-4">
          <RetryButton
            onClick={handleRetry}
            count={retryCount}
            max={maxRetry}
            disabled={isPending}
          />
          <div
            className={
              !isActive ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          >
            <TextButton
              variant={isActive ? "filled" : "outlined"}
              size="medium"
              onClick={handleSubmit}
            >
              음악 신청하기
            </TextButton>
          </div>
        </div>
      </div>
    </div>
  );
}
