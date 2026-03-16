import Image from "next/image";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";
import { Club } from "../model/club";

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <div className="flex flex-col gap-4 bg-sub-4 rounded-2xl px-4 py-6 cursor-pointer w-65.75">
      <div className="relative w-full bg-sub-3 rounded-2xl overflow-hidden h-33.5">
        {club.thumbnailUrl ? (
          <Image
            src={club.thumbnailUrl}
            alt={club.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <DefaultClubThumbnail />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 items-start">
        <span className="text-text-2 text-main-text">{club.name}</span>
        <p className="text-caption-1 text-sub-1 line-clamp-3">
          {club.description}
        </p>
        <span className="text-caption-1 text-p-1">
          동아리 인원: {club.memberCount}명
        </span>
      </div>
    </div>
  );
}
