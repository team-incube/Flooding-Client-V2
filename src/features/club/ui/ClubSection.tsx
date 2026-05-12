"use client";

import ClubCard from "@/entities/club/ui/ClubCard";
import type { Club as ClubModel } from "@/entities/club/model/club";

interface ClubSectionProps {
  clubs: ClubModel[];
  onClubClick: (clubId: number) => void;
}

function ClubSection({ clubs, onClubClick }: ClubSectionProps) {
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
