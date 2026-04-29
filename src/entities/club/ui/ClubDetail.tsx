import Image from "next/image";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";
import { TextButton } from "@/shared/ui/Button/TextButton";
import type { ClubDetailResponse as ClubDetailType, ClubMember } from "../model/club";
import ProjectCard from "./ProjectCard";
import ClubMemberList from "./ClubMemberList";

interface ClubDetailProps {
  detail: ClubDetailType;
  isLeader?: boolean;
  isApplyPending?: boolean;
  onApplyClick?: () => void;
  onViewApplicationsClick?: () => void;
  onCreateFormClick?: () => void;
  onTransferClick?: (member: ClubMember) => void;
  formActionLabel?: string;
}

export default function ClubDetail({
  detail,
  isLeader = false,
  isApplyPending = false,
  onApplyClick,
  onViewApplicationsClick,
  onCreateFormClick,
  onTransferClick,
  formActionLabel = "폼 만들기",
}: ClubDetailProps) {
  const { club, members, projects } = detail;
  const applyVariant = isApplyPending || !onApplyClick ? "disabled" : "filled";

  return (
    <div className="flex w-full flex-col gap-6 xl:flex-row">
      <div className="flex w-full 2xl:w-121 lg:w-100 flex-col 2xl:gap-6 lg:gap-4">
        <div className="relative w-full rounded-2xl overflow-hidden bg-sub-4">
          {club.imageUrl ? (
            <Image
              src={club.imageUrl}
              alt={club.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center 2xl:w-full 2xl:h-full lg:w-100 lg:h-52">
              <DefaultClubThumbnail className="w-full h-full" />
            </div>
          )}
        </div>

        <span className="2xl:text-title-1 lg:text-title-2 text-main-text">
          {club.name}
        </span>

        <div className="flex flex-col gap-1.5">
          <span className="2xl:text-title-4 lg:text-text-1 text-main-text">
            동아리 소개
          </span>
          <p className="2xl:text-text-1 lg:text-text-2 text-sub-1">
            {club.description}
          </p>
        </div>

        <ClubMemberList
          members={members}
          leader={club.leader}
          isLeader={isLeader}
          onMemberClick={onTransferClick}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:self-stretch">
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <span className="text-text-1 text-main-text">동아리 프로젝트</span>
          {projects.length > 0 ? (
            <div className="flex flex-col gap-4">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} leader={club.leader} />
              ))}
            </div>
          ) : (
            <p className="text-caption-1 text-sub-2">
              등록된 프로젝트가 없어요.
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {onViewApplicationsClick && (
            <TextButton
              size="medium"
              variant="outlined"
              className="h-[47px] w-auto min-w-[147px] px-4"
              onClick={onViewApplicationsClick}
            >
              신청자 목록
            </TextButton>
          )}
          {onCreateFormClick && (
            <TextButton
              size="medium"
              variant="outlined"
              className="h-[47px]"
              onClick={onCreateFormClick}
            >
              {formActionLabel}
            </TextButton>
          )}
          <TextButton
            size="wide"
            variant={applyVariant}
            onClick={applyVariant === "filled" ? onApplyClick : undefined}
          >
            동아리 신청하기
          </TextButton>
        </div>
      </div>
    </div>
  );
}
