import Image from "next/image";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";
import { Club } from "../model/club";

interface ClubCardProps {
  club: Club;
  onClick?: () => void;
  showMemberCount?: boolean;
}

export default function ClubCard({
  club,
  onClick,
  showMemberCount = true,
}: ClubCardProps) {
  return (
    <div
      className="bg-sub-4 flex cursor-pointer flex-col gap-4 rounded-2xl px-4 py-6"
      onClick={onClick}
    >
      <div className="bg-sub-4 relative h-33.5 w-full overflow-hidden rounded-2xl">
        {club.imageUrl ? (
          <Image
            src={club.imageUrl}
            alt={club.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <DefaultClubThumbnail />
          </div>
        )}
        <span className="bg-p-1 text-caption-2 absolute left-2 top-2 rounded-md px-2 py-0.5 text-white">
          {club.type === "MAJOR_CLUB" ? "전공" : "자율"}
        </span>
      </div>
      <div className="flex flex-col items-start gap-1">
        <span className="text-text-2 text-main-text">{club.name}</span>
        <p className="text-caption-1 text-sub-1 line-clamp-2">
          {club.description}
        </p>
        {showMemberCount && (
          <span className="text-caption-1 text-sub-2">
            동아리 인원: {club.totalMember}명
          </span>
        )}
      </div>
    </div>
  );
}
