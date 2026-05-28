"use client";

import { ReactNode, useState } from "react";
import { MusicListItem } from "@/entities/music/ui/MusicListItem";
import { Calendar } from "@/shared/ui/Calendar";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";
import Music from "@/shared/asset/svg/Music";
import { MusicRecommendModal } from "@/features/wake-up-music/ui/MusicRecommendModal";
import { useWakeUpMusic } from "@/features/wake-up-music/model/useWakeUpMusic";

interface WakeUpMusicSectionProps {
  icon?: ReactNode;
  className?: string;
}

export function WakeUpMusicSection({
  icon,
  className,
}: WakeUpMusicSectionProps) {
  const {
    urlInput,
    setUrlInput,
    canApply,
    isToday,
    selectedDate,
    setSelectedDate,
    songs,
    me,
    applyMutation,
    handleApplyMusic,
    handleSubmitRecommendedMusic,
    likeMutation,
    cancelMutation,
  } = useWakeUpMusic();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className={`bg-background-surface relative flex h-auto flex-col gap-6 rounded-2xl p-5 sm:h-[424px] sm:p-6 2xl:h-[520px] ${className ?? ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-end gap-3">
        <div className="flex items-center gap-2">
          <Music />
          <span className="text-main-text text-text-1">기상음악 신청</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-caption-1">신청 음악</span>
          <span className="text-p-1 text-caption-1">{songs.length}개</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col-reverse gap-6 overflow-hidden sm:flex-row">
        <div className="min-w-0 flex-1 overflow-y-auto sm:pr-2">
          <div className="flex flex-col">
            {songs.map((music) => {
              return (
                <MusicListItem
                  key={music.id}
                  music={music}
                  isLikePending={
                    likeMutation.isPending &&
                    likeMutation.variables?.id === music.id
                  }
                  onToggleLike={() => likeMutation.mutate(music)}
                  onDelete={
                    me?.id && me.id === music.userId
                      ? () => cancelMutation.mutate(music.id)
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
        </div>

        <div className="flex w-full flex-col gap-6 sm:w-[240px] sm:shrink-0 sm:gap-20 lg:w-[330px]">
          <div className="flex flex-col gap-3">
            <span className="text-main-text text-text-2">음악 신청</span>
            <TextField
              placeholder="URL을 입력해주세요"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <TextButton
              variant={
                !canApply || applyMutation.isPending || !isToday
                  ? "disabled"
                  : "filled"
              }
              size="wide"
              className="w-full"
              onClick={handleApplyMusic}
            >
              신청하기
            </TextButton>
          </div>

          {!icon && (
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}
        </div>
      </div>

      {icon && (
        <button
          className="bg-p-2 absolute right-6 bottom-6 flex h-13 w-13 cursor-pointer items-center justify-center rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          {isHovered && (
            <div className="pointer-events-none absolute right-0 bottom-full mb-4">
              <div className="bg-surface text-sub-1 relative rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-[0_0_24px_rgba(0,0,0,0.1)]">
                오늘의 노래를 <span className="text-p-1">AI</span>한테 추천
                받아봐요!
                <div className="bg-background-surface absolute right-[22px] -bottom-1.5 h-3 w-3 rotate-45"></div>
              </div>
            </div>
          )}
          {icon}
        </button>
      )}

      {isModalOpen && (
        <MusicRecommendModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitRecommendedMusic}
        />
      )}
    </section>
  );
}
