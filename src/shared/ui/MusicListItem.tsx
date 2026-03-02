import { Music } from "@/entities/music/model/music";
import Image from "next/image";

interface MusicListItemProps {
  music: Music;
}

export function MusicListItem({ music }: MusicListItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-sub-3 last:border-b-0">
      <div className="w-39 h-22 shrink-0 rounded-xl bg-sub-4 overflow-hidden">
        {music.thumbnailUrl && (
          <Image
            src={music.thumbnailUrl}
            alt={music.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 gap-6 min-w-0 items-center justify-between pr-15">
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
