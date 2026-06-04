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
}

function formatAppliedDate(appliedAt: string) {
  return formatTime(appliedAt);
}

export function MusicListItem({
  music,
  onToggleLike,
  isLikePending = false,
  onDelete,
  isDeletePending = false,
}: MusicListItemProps) {
  const thumbnailUrl =
    music.thumbnailUrl ?? getYoutubeThumbnailUrl(music.musicUrl);
  const title = music.title ?? music.musicUrl;

  return (
    <div className="border-sub-3 flex min-w-0 items-center justify-between gap-2 overflow-hidden border-b py-3 pr-2 last:border-b-0 sm:gap-4 sm:pr-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <a
          href={music.videoUrl ?? music.musicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-sub-4 relative h-14 w-24 shrink-0 overflow-hidden rounded-lg sm:h-17 sm:w-30 2xl:h-22 2xl:w-39"
        >
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
            />
          )}
          {music.durationText && (
            <span className="text-caption-3 absolute right-1.5 bottom-1.5 line-clamp-1 rounded bg-black/70 px-1.5 py-0.5 text-white">
              {music.durationText}
            </span>
          )}
        </a>

        <div className="flex min-w-0 flex-1 flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:gap-6">
          <p className="text-text-1 text-main-text scrollbar-hide line-clamp-1 min-w-0 overflow-x-auto mask-[linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] font-semibold whitespace-nowrap [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] 2xl:flex-1">
            {title}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 2xl:flex-nowrap 2xl:gap-6">
            <span className="text-caption-2 text-sub-2 line-clamp-1">
              {formatAppliedDate(music.appliedAt)}
            </span>
            <span className="text-caption-2 text-sub-1 line-clamp-1">
              {music.studentNumber} {music.userName}
            </span>
          </div>
        </div>
      </div>

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
