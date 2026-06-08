"use no memo";
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MusicListItem } from "@/entities/music/ui/MusicListItem";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { NoteText } from "@/shared/ui/NoteText";
import TextField from "@/shared/ui/textField";
import Music from "@/shared/asset/svg/Music";
import { MusicRecommendModal } from "@/features/wake-up-music/ui/MusicRecommendModal";
import { MusicListModal } from "@/features/wake-up-music/ui/MusicListModal";
import { MusicRecommendButton } from "@/features/wake-up-music/ui/MusicRecommendButton";
import { useWakeUpMusic } from "@/features/wake-up-music/model/useWakeUpMusic";
import { useWakeUpMusicSubscription } from "@/features/wake-up-music/model/useWakeUpMusicSubscription";
import { MusicFilterDropdown } from "@/features/wake-up-music/ui/MusicFilterDropdown";
import { useMusicFilter } from "@/features/wake-up-music/model/useMusicFilter";

const Calendar = dynamic(
  () => import("@/shared/ui/Calendar").then((m) => m.Calendar),
  { ssr: false },
);

interface WakeUpMusicSectionProps {
  compact?: boolean;
  className?: string;
}

export function WakeUpMusicSection({
  compact,
  className,
}: WakeUpMusicSectionProps) {
  const { sort, setSort, filterParams, filterButtonLabel, hasFilter } =
    useMusicFilter();

  const {
    urlInput,
    setUrlInput,
    canApply,
    isToday,
    selectedDate,
    setSelectedDate,
    songs,
    me,
    canDeleteAnyMusic,
    applyMutation,
    handleApplyMusic,
    handleSubmitRecommendedMusic,
    likeMutation,
    cancelMutation,
  } = useWakeUpMusic(filterParams);

  useWakeUpMusicSubscription();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const isApplyDisabled = !isToday || !canApply || applyMutation.isPending;

  return (
    <section
      className={`bg-background-surface relative flex h-auto flex-col gap-6 rounded-2xl p-5 sm:p-6 lg:h-[424px] 2xl:h-[520px] ${className ?? ""}`}
    >
      <div className="flex items-end justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-end gap-x-3 gap-y-1">
          <div className="flex shrink-0 items-center gap-2">
            <Music />
            <span className="text-main-text text-text-1">기상음악 신청</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="text-sub-1 text-caption-1">신청 음악</span>
            <span className="text-p-1 text-caption-1">{songs.length}개</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsListModalOpen(true)}
            className="text-caption-1 text-sub-1 hover:bg-surface cursor-pointer rounded px-2 py-1 transition-colors"
          >
            크게 보기
          </button>
          <MusicFilterDropdown
            sort={sort}
            onSortChange={setSort}
            currentFilterLabel={filterButtonLabel}
            hasFilter={hasFilter}
          />
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col-reverse gap-6 overflow-hidden lg:flex-row">
        <div className="relative max-h-[360px] min-h-0 min-w-0 flex-1 lg:max-h-none">
          <div className="h-full overflow-x-hidden overflow-y-auto lg:absolute lg:inset-0 lg:pr-2">
            <div className="flex min-w-0 flex-col">
              {songs.map((music) => (
                <MusicListItem
                  key={music.id}
                  music={music}
                  isLikePending={
                    likeMutation.isPending &&
                    likeMutation.variables?.id === music.id
                  }
                  onToggleLike={() => likeMutation.mutate(music)}
                  onDelete={
                    me?.id && (me.id === music.userId || canDeleteAnyMusic)
                      ? () => cancelMutation.mutate(music.id)
                      : undefined
                  }
                  isDeletePending={
                    cancelMutation.isPending &&
                    cancelMutation.variables === music.id
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-6 lg:w-auto lg:max-w-[380px] lg:gap-20">
          <div className="flex min-w-0 flex-col gap-3">
            <span className="text-main-text text-text-2">음악 신청</span>
            <TextField
              placeholder="URL을 입력해주세요"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <TextButton
              variant={isApplyDisabled ? "disabled" : "filled"}
              size="wide"
              className="w-full"
              onClick={handleApplyMusic}
            >
              {isToday ? "신청하기" : "신청 불가"}
            </TextButton>
            <div className="flex flex-col gap-1">
              <NoteText>※ 기상음악은 오늘 날짜에만 신청할 수 있어요</NoteText>
            </div>
          </div>

          {!compact && (
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}

          {!compact && (
            <div className="flex justify-end">
              <MusicRecommendButton onClick={() => setIsModalOpen(true)} />
            </div>
          )}
        </div>
      </div>

      {compact && (
        <div className="absolute right-6 bottom-6">
          <MusicRecommendButton onClick={() => setIsModalOpen(true)} />
        </div>
      )}

      {isListModalOpen && (
        <MusicListModal
          isOpen={isListModalOpen}
          songs={songs}
          meId={me?.id}
          canDeleteAnyMusic={canDeleteAnyMusic}
          sort={sort}
          onSortChange={setSort}
          filterButtonLabel={filterButtonLabel}
          hasFilter={hasFilter}
          onClose={() => setIsListModalOpen(false)}
          onToggleLike={(music) => likeMutation.mutate(music)}
          onDelete={(musicId) => cancelMutation.mutate(musicId)}
          likeMutation={likeMutation}
          cancelMutation={cancelMutation}
        />
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
