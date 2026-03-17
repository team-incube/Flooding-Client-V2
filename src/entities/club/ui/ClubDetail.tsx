import Image from "next/image";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";
import { ClubDetail as ClubDetailType } from "../model/club";
import ProjectCard from "./ProjectCard";
import ClubMemberList from "./ClubMemberList";

interface ClubDetailProps {
  detail: ClubDetailType;
}

export default function ClubDetail({ detail }: ClubDetailProps) {
  const { club, member, project } = detail;

  return (
    <div className="flex gap-6 w-full">
      <div className="flex flex-col gap-6 w-121 shrink-0">
        <div className="relative w-121 h-70.25 rounded-2xl overflow-hidden bg-sub-3">
          {club.imageUrl ? (
            <Image
              src={club.imageUrl}
              alt={club.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <DefaultClubThumbnail className="w-full h-full" />
            </div>
          )}
        </div>

        <span className="text-title-1 text-main-text">{club.name}</span>

        <div className="flex flex-col gap-1">
          <span className="text-title-4 text-main-text">동아리 소개</span>
          <p className="text-text-1 text-sub-1">{club.description}</p>
        </div>

        <ClubMemberList members={member} />
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <span className="text-text-1 text-main-text">동아리 프로젝트</span>
        {project.length > 0 ? (
          <div className="flex flex-col gap-4">
            {project.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <p className="text-caption-1 text-sub-2">등록된 프로젝트가 없어요.</p>
        )}
      </div>
    </div>
  );
}
