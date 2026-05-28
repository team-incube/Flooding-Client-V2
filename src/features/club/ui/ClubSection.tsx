"use client";

import ClubCard from "@/entities/club/ui/ClubCard";
import type { Club as ClubModel } from "@/entities/club/model/club";
import FileOff from "@/shared/asset/svg/FileOff";

interface ClubSectionProps {
  clubs: ClubModel[];
  onClubClick: (clubId: number) => void;
}

function ClubSection({ clubs, onClubClick }: ClubSectionProps) {
  if (clubs.length === 0) {
    return (
      <div className="flex h-full min-h-60 flex-1 flex-col items-center justify-center gap-2">
        <FileOff />
        <p className="text-text-3 text-sub-2">등록된 동아리가 없어요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(263px,1fr))] gap-4">
      {clubs.map((club) => (
        <ClubCard
          key={club.id}
          club={club}
          onClick={() => onClubClick(club.id)}
        />
      ))}
    </div>
  );
}

export { ClubSection };
