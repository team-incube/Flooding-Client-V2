import type { ReactNode } from "react";
import type { Music } from "@/entities/music/model/music";
import { getYoutubeThumbnailUrl } from "@/entities/music/lib/youtube";
import Heart from "@/shared/asset/svg/Heart";
import Delete from "@/shared/asset/svg/Delete";
import Image from "next/image";
import { formatTime } from "@/shared/lib/date";

interface MusicListItemProps {
  music: Music;
  onToggleLike?: () => void;
  isLikePending?: boolean;
  onDelete?: () => void;
  isDeletePending?: boolean;
  thumbnailOverlay?: ReactNode;
  aiStatus?: ReactNode;
  onSelect?: () => void;
  isSelected?: boolean;
}

function formatAppliedDate(appliedAt: string) {
  return formatTime(appliedAt);
}

const THUMBNAIL_CLASS =
  "bg-sub-4 relative h-14 w-24 shrink-0 overflow-hidden rounded-lg sm:h-17 sm:w-30 2xl:h-22 2xl:w-39";

export function MusicListItem({
  music,
  onToggleLike,
  isLikePending = false,
  onDelete,
  isDeletePending = false,
  thumbnailOverlay,
  aiStatus,
  onSelect,
  isSelected = false,
}: MusicListItemProps) {
  const thumbnailUrl =
    music.thumbnailUrl ?? getYoutubeThumbnailUrl(music.musicUrl);
  const title = music.title ?? music.musicUrl;

  const thumbnailInner = (
    <>
      {thumbnailUrl && (
        <Image src={thumbnailUrl} alt={title} fill className="object-cover" />
      )}
      {music.durationText && (
        <span className="text-caption-3 absolute right-1.5 bottom-1.5 line-clamp-1 rounded bg-black/70 px-1.5 py-0.5 text-white">
          {music.durationText}
        </span>
      )}
      {thumbnailOverlay}
    </>
  );

  const info = (
    <div className="flex flex-col gap-2">
      <p
        className={`text-text-1 font-semibold whitespace-nowrap ${isSelected ? "text-p-1" : "text-main-text"}`}
      >
        {title}
      </p>
      <div className="flex items-center gap-3">
        <span className="text-caption-2 text-sub-1 whitespace-nowrap">
          {music.studentNumber} {music.userName}
        </span>
        <span className="text-caption-2 text-sub-2 whitespace-nowrap">
          {formatAppliedDate(music.appliedAt)}
        </span>
      </div>
      {aiStatus}
    </div>
  );

  return (
    <div className="border-sub-3 flex items-center justify-between gap-2 overflow-hidden border-b py-3 pr-2 last:border-b-0 sm:gap-4 sm:pr-6">
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className="scrollbar-hide flex flex-1 cursor-pointer items-center gap-2 overflow-x-auto text-left sm:gap-4"
        >
          <span className={THUMBNAIL_CLASS}>{thumbnailInner}</span>
          {info}
        </button>
      ) : (
        <div className="scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto sm:gap-4">
          <a
            href={music.videoUrl ?? music.musicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={THUMBNAIL_CLASS}
          >
            {thumbnailInner}
          </a>
          {info}
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2">
        {onDelete && (
          <button
            type="button"
            className="bg-sub-4 flex size-10 cursor-pointer items-center justify-center rounded-lg transition-opacity disabled:cursor-default disabled:opacity-60"
            disabled={isDeletePending}
            onClick={onDelete}
          >
            <Delete />
          </button>
        )}

        <div className="relative flex shrink-0 flex-col items-center">
          <button
            type="button"
            className="bg-sub-4 flex size-10 cursor-pointer items-center justify-center rounded-lg transition-opacity disabled:cursor-default disabled:opacity-60"
            disabled={isLikePending}
            onClick={onToggleLike}
          >
            <Heart isActive={music.isLiked} />
          </button>
          <span className="text-caption-1 text-sub-1 absolute top-full mt-1">
            {music.likeCount}
          </span>
        </div>
      </div>
    </div>
  );
}
