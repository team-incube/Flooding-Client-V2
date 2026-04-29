"use client";

import { useState } from "react";
import Image from "next/image";
import DefaultClubThumbnail from "@/shared/asset/svg/DefaultThumbnail";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";
import Search from "@/shared/asset/svg/Search";
import Edit from "@/shared/asset/svg/Edit";
import Cancel from "@/shared/asset/svg/Cancel";
import type {
  ClubDetailResponse as ClubDetailType,
  ClubMember,
} from "../model/club";
import type { User } from "@/entities/user/model/user";
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
  onEditClick?: () => void;
  memberSearchQuery?: string;
  memberSearchResults?: User[];
  onMemberSearchChange?: (query: string) => void;
  onMemberInvite?: (user: User) => void;
  onMemberExile?: (memberId: number) => void;
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
  onEditClick,
  memberSearchQuery = "",
  memberSearchResults = [],
  onMemberSearchChange,
  onMemberInvite,
  onMemberExile,
  formActionLabel = "폼 만들기",
}: ClubDetailProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  const { club, members, projects } = detail;
  const applyVariant = isApplyPending || !onApplyClick ? "disabled" : "filled";
  const nonLeaderMembers = members.filter((m) => m.name !== club.leader);

  const handleEditClick = () => {
    setIsEditMode((prev) => !prev);
    onEditClick?.();
  };

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

        {isLeader && isEditMode && (
          <div className="flex flex-col gap-3">
            <span className="2xl:text-title-4 lg:text-text-1 text-main-text">
              부원 추가
            </span>
            <div className="relative">
              <TextField
                value={memberSearchQuery}
                onChange={(e) => onMemberSearchChange?.(e.target.value)}
                placeholder="이름, 학번을 입력해주세요"
                rightIcon={<Search />}
              />
              {memberSearchResults.length > 0 && memberSearchQuery.trim() && (
                <div className="absolute z-10 w-full mt-1 border border-sub-4 rounded-lg overflow-hidden bg-background-surface shadow-md">
                  <div className="flex flex-col divide-y divide-sub-4 px-2">
                    {memberSearchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => onMemberInvite?.(user)}
                        className="w-full text-left py-3 px-2 text-text-2 text-main-text hover:bg-sub-4 transition-colors"
                      >
                        {user.studentNumber} {user.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {nonLeaderMembers.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {nonLeaderMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-center gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 2xl:px-6 2xl:py-3 rounded-[38px] border border-sub-2 bg-background-surface text-caption-1 2xl:text-text-2 text-main-text"
                  >
                    <span className="whitespace-nowrap">
                      {member.studentNumber} {member.name}
                    </span>
                    {onMemberExile && (
                      <button
                        type="button"
                        onClick={() => onMemberExile(member.id)}
                        className="shrink-0 flex items-center [&>svg]:w-3 [&>svg]:h-3 2xl:[&>svg]:w-3.5 2xl:[&>svg]:h-3.5 text-sub-2 hover:text-negative transition-colors"
                        aria-label={`${member.name} 추방`}
                      >
                        <Cancel />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
          {isLeader && onEditClick && (
            <button
              type="button"
              onClick={handleEditClick}
              className={`flex items-center justify-center w-11.75 h-11.75 rounded-xl transition-colors ${
                isEditMode ? "bg-sub-3" : "bg-sub-4 hover:bg-sub-3"
              }`}
              aria-label="동아리 수정"
            >
              <Edit />
            </button>
          )}
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
