import { Music } from "@/entities/music/model/music";
import { User } from "@/entities/user/model/user";
import Image from "next/image";

interface MusicListItemProps {
  student: User;
  music: Music;
}

export function MusicListItem({ student, music }: MusicListItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-sub-3 last:border-b-0">
      <div className="w-24 h-22 shrink-0 rounded-xl bg-sub-4 overflow-hidden">
        {music.thumbnailUrl && (
          <Image
            src={music.thumbnailUrl}
            alt={music.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 min-w-0 items-center justify-between">
        <p className="text-main-text font-medium text-[15px] line-clamp-2 flex-1 min-w-0 pr-4">
          {music.title}
        </p>
        <span className="text-sub-1 text-sm shrink-0 pr-4">
          {student.studentNumber}
          {student.name}
        </span>
        <span className="text-sub-2 text-[13px] shrink-0">
          {music.appliedAt}
        </span>
      </div>
    </div>
  );
}
