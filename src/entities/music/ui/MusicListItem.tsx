import type { Music } from "@/entities/music/model/music";
import type { YoutubeVideoMetadata } from "@/entities/music/api/youtubeQueries";
import { getYoutubeThumbnailUrl } from "@/entities/music/lib/youtube";
import Heart from "@/shared/asset/svg/Heart";
import Image from "next/image";

interface MusicListItemProps {
  music: Music;
  youtubeMetadata?: YoutubeVideoMetadata;
  onToggleLike?: () => void;
  isLikePending?: boolean;
}

function formatAppliedDate(appliedAt: string) {
  return appliedAt.split("T")[0] || appliedAt;
}

export function MusicListItem({
  music,
  youtubeMetadata,
  onToggleLike,
  isLikePending = false,
}: MusicListItemProps) {
  const thumbnailUrl =
    youtubeMetadata?.thumbnailUrl ??
    getYoutubeThumbnailUrl(music.musicUrl);
  const title = youtubeMetadata?.title ?? music.musicUrl;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-sub-3 py-3 pr-6 last:border-b-0">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative h-17 w-30 shrink-0 overflow-hidden rounded-lg bg-sub-4 2xl:h-22 2xl:w-39">
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
            />
          )}
          {youtubeMetadata?.durationText && (
            <span className="absolute right-1.5 bottom-1.5 rounded bg-black/70 px-1.5 py-0.5 text-caption-3 text-white">
              {youtubeMetadata.durationText}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:gap-6">
          <p className="line-clamp-2 break-all text-text-1 font-semibold text-main-text 2xl:min-w-0 2xl:flex-1">
            {title}
          </p>
          <div className="flex shrink-0 items-center justify-between 2xl:justify-start 2xl:gap-6">
            <span className="shrink-0 text-caption-2 text-sub-2">
              {formatAppliedDate(music.appliedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center justify-center gap-1">
        <button
          type="button"
          className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-sub-4 transition-opacity disabled:cursor-default disabled:opacity-60"
          disabled={isLikePending}
          onClick={onToggleLike}
        >
          <Heart isActive={music.isLiked} />
        </button>
        <span className="text-caption-1 text-sub-1">{music.likeCount}</span>
      </div>
    </div>
  );
}
