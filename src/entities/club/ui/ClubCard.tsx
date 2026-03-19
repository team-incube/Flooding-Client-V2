import Image from "next/image";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";
import { Club } from "../model/club";

interface ClubCardProps {
  club: Club;
  onClick?: () => void;
}

export default function ClubCard({ club, onClick }: ClubCardProps) {
  return (
    <div
      className="flex flex-col gap-4 bg-sub-4 rounded-2xl px-4 py-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full bg-sub-4 rounded-2xl overflow-hidden h-33.5">
        {club.imageUrl ? (
          <Image
            src={club.imageUrl}
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
        <p className="text-caption-1 text-sub-1 line-clamp-2">
          {club.description}
        </p>
        <span className="text-caption-1 text-sub-2">
          동아리 인원: {club.totalMember}명
        </span>
      </div>
    </div>
  );
}
