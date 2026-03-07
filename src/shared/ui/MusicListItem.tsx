import { Music } from "@/entities/music/model/music";
import Image from "next/image";

interface MusicListItemProps {
  music: Music;
}

export function MusicListItem({ music }: MusicListItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-sub-3 last:border-b-0">
      <div className="relative w-22 h-22 2xl:w-39 2xl:h-22 shrink-0 rounded-xl bg-sub-4 overflow-hidden">
        {music.thumbnailUrl && (
          <Image
            src={music.thumbnailUrl}
            alt={music.title}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-3 2xl:hidden">
        <p className="text-main-text font-semibold text-text-1 line-clamp-1">
          {music.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sub-1 text-text-3">
            {music.studentNumber} {music.studentName}
          </span>
          <span className="text-sub-2 text-caption-2 shrink-0">
            {music.appliedAt}
          </span>
        </div>
      </div>

      <div className="hidden 2xl:flex flex-1 gap-6 min-w-0 items-center justify-between pr-15">
        <p className="text-main-text text-text-4 line-clamp-2 flex-1 min-w-0 pr-4">
          {music.title}
        </p>
        <span className="text-sub-1 text-sm tabular-nums shrink-0 pr-4">
          {music.studentNumber} {music.studentName}
        </span>
        <span className="text-sub-2 text-caption-2 shrink-0">
          {music.appliedAt}
        </span>
      </div>
    </div>
  );
}
