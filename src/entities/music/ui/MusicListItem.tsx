import type { Music } from "@/entities/music/model/music";
import Image from "next/image";

interface MusicListItemProps {
  music: Music;
}

export function MusicListItem({ music }: MusicListItemProps) {
  return (
    <div className="flex items-center gap-4 border-b border-sub-3 py-3 last:border-b-0">
      <div className="relative h-17 w-30 shrink-0 overflow-hidden rounded-xl bg-sub-4 2xl:h-22 2xl:w-39">
        {music.thumbnailUrl && (
          <Image
            src={music.thumbnailUrl}
            alt={music.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:gap-6 2xl:pr-15">
        <p className="line-clamp-2 text-text-1 font-semibold text-main-text 2xl:min-w-0 2xl:flex-1">
          {music.title}
        </p>
        <div className="flex shrink-0 items-center justify-between 2xl:justify-start 2xl:gap-6">
          <span className="text-text-3 text-sub-1">
            {music.studentNumber} {music.studentName}
          </span>
          <span className="shrink-0 text-caption-2 text-sub-2">
            {music.appliedAt}
          </span>
        </div>
      </div>
    </div>
  );
}
