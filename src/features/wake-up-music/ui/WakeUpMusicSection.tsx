"use no memo";
"use client";

import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import { MusicListItem } from "@/entities/music/ui/MusicListItem";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { NoteText } from "@/shared/ui/NoteText";
import TextField from "@/shared/ui/textField";
import Music from "@/shared/asset/svg/Music";
import { MusicRecommendModal } from "@/features/wake-up-music/ui/MusicRecommendModal";
import { MusicListModal } from "@/features/wake-up-music/ui/MusicListModal";
import { useWakeUpMusic } from "@/features/wake-up-music/model/useWakeUpMusic";
import { MusicFilterDropdown } from "@/features/wake-up-music/ui/MusicFilterDropdown";
import { useMusicFilter } from "@/features/wake-up-music/model/useMusicFilter";

const Calendar = dynamic(
  () => import("@/shared/ui/Calendar").then((m) => m.Calendar),
  { ssr: false },
);

interface WakeUpMusicSectionProps {
  icon?: ReactNode;
  className?: string;
}

export function WakeUpMusicSection({
  icon,
  className,
}: WakeUpMusicSectionProps) {
  const {
    filterParams,
    filterState,
    filterButtonLabel,
    hasFilter,
    setFilter,
    clearFilter,
  } = useMusicFilter();

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isApplyDisabled = !isToday || !canApply || applyMutation.isPending;

  return (
    <section
      className={`bg-background-surface relative flex h-auto flex-col gap-6 rounded-2xl p-5 sm:h-[424px] sm:p-6 2xl:h-[520px] ${className ?? ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-end justify-between">
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsListModalOpen(true)}
            className="text-caption-1 text-sub-1 hover:bg-surface cursor-pointer rounded px-2 py-1 transition-colors"
          >
            크게 보기
          </button>
          <MusicFilterDropdown
            onFilterChange={setFilter}
            onClear={clearFilter}
            currentFilterLabel={filterButtonLabel}
            hasFilter={hasFilter}
            filterState={filterState}
          />
        </div>
      </div>

      {/* min-h-0 추가 — flexbox에서 overflow-y-auto가 동작하려면 필수 */}
      <div className="flex min-h-0 flex-1 flex-col-reverse gap-6 overflow-hidden sm:flex-row">
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto sm:pr-2">
          <div className="flex flex-col">
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

        <div className="flex w-full flex-col gap-6 sm:w-auto sm:max-w-[340px] sm:min-w-0 sm:gap-20 md:max-w-[360px] lg:max-w-[380px]">
          <div className="flex flex-col gap-3">
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
          className="bg-p-2 absolute right-6 bottom-6 flex size-13 cursor-pointer items-center justify-center rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          {isHovered && (
            <div className="pointer-events-none absolute right-0 bottom-full mb-4 max-w-[calc(100vw-3rem)]">
              <div className="bg-surface text-sub-1 relative rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-[0_0_24px_rgba(0,0,0,0.1)]">
                내가 최근 <span className="text-p-1">신청한 3곡</span>을
                바탕으로 노래를 추천받아봐요!
                <div className="bg-background-surface absolute right-[22px] -bottom-1.5 size-3 rotate-45"></div>
              </div>
            </div>
          )}
          {icon}
        </button>
      )}

      {isListModalOpen && (
        <MusicListModal
          isOpen={isListModalOpen}
          songs={songs}
          meId={me?.id}
          canDeleteAnyMusic={canDeleteAnyMusic}
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
