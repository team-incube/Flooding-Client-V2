"use client";

import SmallStar from "@/shared/asset/svg/SmallStar";
import Cancel from "@/shared/asset/svg/Cancel";
import MusicRecommendCard from "@/features/wake-up-music/ui/MusicRecommendCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import RetryButton from "@/shared/ui/Button/RetryButton";
import { useAiMusicRecommend } from "@/features/wake-up-music/model/useAiMusicRecommend";

interface MusicRecommendModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUrl: string) => Promise<void> | void;
}

export function MusicRecommendModal({
  open,
  onClose,
  onSubmit,
}: MusicRecommendModalProps) {
  const {
    displayCards,
    selectedUrl,
    retryCount,
    maxRetry,
    isActive,
    isPending,
    handleSelect,
    handleRetry,
  } = useAiMusicRecommend(open);

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
    <div className="fixed inset-0 flex items-center justify-center bg-[#F7F7F9]/50 z-50">
      <div className="flex flex-col gap-6 bg-background-surface rounded-2xl p-6 w-[90%] max-w-[1152px] min-h-[447px]">
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
          <span className="text-sub-2">
            ※ 노래 추천은 이전에 신청한 곡을 기반으로 노래를 추천해요
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto min-h-[203px]">
          {isPending
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-90 h-[203px] bg-sub-4 rounded-xl shrink-0 animate-pulse"
                />
              ))
            : displayCards.map((card) => (
                <MusicRecommendCard
                  key={card.url}
                  title={card.title}
                  thumbnailUrl={card.thumbnailUrl}
                  checked={selectedUrl === card.url}
                  onChange={() => handleSelect(card.url)}
                />
              ))}
        </div>

        <div className="flex justify-end gap-4">
          <RetryButton
            onClick={handleRetry}
            count={retryCount}
            max={maxRetry}
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
