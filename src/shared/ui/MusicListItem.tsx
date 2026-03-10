import { Music } from "@/entities/music/model/music";
import Image from "next/image";

interface MusicListItemProps {
  music: Music;
}

export function MusicListItem({ music }: MusicListItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-sub-3 last:border-b-0">
      <div className="relative w-30 h-17 2xl:w-39 2xl:h-22 shrink-0 rounded-xl bg-sub-4 overflow-hidden">
        {music.thumbnailUrl && (
          <Image
            src={music.thumbnailUrl}
            alt={music.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-3 2xl:flex-row 2xl:items-center 2xl:gap-6 2xl:pr-15">
        <p className="text-main-text font-semibold text-text-1 line-clamp-2 2xl:flex-1 2xl:min-w-0">
          {music.title}
        </p>
        <div className="flex items-center justify-between 2xl:justify-start 2xl:gap-6 shrink-0">
          <span className="text-sub-1 text-text-3">
            {music.studentNumber} {music.studentName}
          </span>
          <span className="text-sub-2 text-caption-2 shrink-0">
            {music.appliedAt}
          </span>
        </div>
      </div>
    </div>
  );
}
