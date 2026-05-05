"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ClubThumbnail } from "@/entities/club/ui/ClubThumbnail";
import { ClubActionButtons } from "@/entities/club/ui/ClubActionButtons";
import Edit from "@/shared/asset/svg/Edit";
import Search from "@/shared/asset/svg/Search";
import Cancel from "@/shared/asset/svg/Cancel";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";
import ClubMemberList from "./ClubMemberList";
import ProjectCard from "./ProjectCard";
import type { ClubMember, ClubDetailResponse, Project } from "../model/club";
import type { SearchUser } from "@/entities/user/model/user";
import { usePutClub, useDeleteClub } from "../api/clubQueries";
import FileOff from "@/shared/asset/svg/FileOff";

interface ClubDetailProps {
  detail: ClubDetailResponse;
  isApplyPending?: boolean;
  onApplyClick?: () => void;
  onViewApplicationsClick?: () => void;
  onCreateFormClick?: () => void;
  onTransferClick?: (member: ClubMember) => void;
  onEditClick?: () => void;
  memberSearchQuery?: string;
  memberSearchResults?: SearchUser[];
  onMemberSearchChange?: (query: string) => void;
  onMemberInvite?: (user: SearchUser) => void;
  onMemberExile?: (memberId: number) => void;
  formActionLabel?: string;
  canDelete?: boolean;
}

export default function ClubDetail({
  detail,
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
  canDelete = false,
}: ClubDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { club, members, projects, isLeader } = detail;

  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState(club.description ?? "");
  const [previewUrl, setPreviewUrl] = useState(club.imageUrl ?? "");

  const applyVariant = isApplyPending || !onApplyClick ? "disabled" : "filled";
  const nonLeaderMembers = members.filter((m) =>
    club.leaderId !== undefined ? m.id !== club.leaderId : m.name !== club.leader,
  );

  const { mutateAsync: updateClub } = usePutClub();
  const { mutateAsync: deleteClub } = useDeleteClub();

  const handleSave = () => {
    const promise = updateClub({
      clubId: club.id,
      body: {
        name: club.name,
        description,
        imageUrl: previewUrl,
        maxMember: club.maxMember,
      },
    });
    toast.promise(promise, {
      loading: "저장 중...",
      success: () => {
        setIsEdit(false);
        queryClient.invalidateQueries({ queryKey: ["club", "detail", club.id] });
        return "저장되었습니다.";
      },
      error: "저장에 실패했습니다.",
    });
  };

  const handleDelete = () => {
    deleteClub(club.id).then(() => {
      router.push("/club");
      toast.success("삭제되었습니다.");
    });
  };

  return (
    <div className="flex w-full flex-col gap-6 xl:flex-row">
      <div className="flex w-full 2xl:w-121 lg:w-100 flex-col gap-6">
        <ClubThumbnail
          imageUrl={previewUrl}
          isEdit={isEdit}
          onImageChange={(file) => {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
          }}
        />

        <div className="flex flex-col gap-4">
          <span className="2xl:text-title-1 lg:text-title-2 text-main-text font-bold">
            {club.name}
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="2xl:text-title-4 lg:text-text-1 text-main-text font-semibold">
              동아리 소개
            </span>
            {isEdit ? (
              <div className="flex flex-col gap-1">
                <textarea
                  className="w-full text-text-1 text-sub-1 p-4 rounded-lg border border-sub-2 bg-background-surface outline-none focus:border-sub-1 transition-all resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <span className="text-xs text-right text-sub-2">
                  {description.length}/500
                </span>
              </div>
            ) : (
              <p className="2xl:text-text-1 lg:text-text-2 text-sub-1 whitespace-pre-wrap leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {!isEdit ? (
            <ClubMemberList
              members={members}
              leader={club.leader}
              isLeader={isLeader}
              onMemberClick={onTransferClick}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <ClubMemberList
                members={members}
                leader={club.leader}
                showDescription={false}
              />
              <div className="flex flex-col gap-2">
                <span className="text-main-text font-semibold">부원 추가</span>
                <div className="relative">
                  <TextField
                    placeholder="이름, 학번을 입력해주세요"
                    value={memberSearchQuery}
                    onChange={(e) => onMemberSearchChange?.(e.target.value)}
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
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 xl:self-stretch justify-between">
        <div className="flex flex-col gap-4 h-full">
          <span className="text-text-1 text-main-text">동아리 프로젝트</span>
          {projects.length > 0 ? (
            projects.map((p: Project) => (
              <ProjectCard key={p.id} project={p} leader={club.leader} />
            ))
          ) : (
            <div className="flex flex-col gap-2 h-full items-center justify-center">
              <FileOff />
              <span className="text-text-3 text-sub-2">
                등록된 프로젝트가 없어요!
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {!isEdit && isLeader && (
            <button
              type="button"
              onClick={() => { setIsEdit(true); onEditClick?.(); }}
              className="flex items-center justify-center w-11.75 h-11.75 rounded-xl bg-sub-4 hover:bg-sub-3 transition-colors"
              aria-label="동아리 수정"
            >
              <Edit />
            </button>
          )}
          <ClubActionButtons
            isEdit={isEdit}
            canDelete={canDelete}
            onSave={handleSave}
            onCancel={() => {
              setIsEdit(false);
              setPreviewUrl(club.imageUrl ?? "");
            }}
            onDelete={handleDelete}
          />
          {!isEdit && (
            <>
              {onViewApplicationsClick && (
                <TextButton
                  size="medium"
                  variant="outlined"
                  className="h-11.75 w-auto min-w-36.75 px-4"
                  onClick={onViewApplicationsClick}
                >
                  신청자 목록
                </TextButton>
              )}
              {onCreateFormClick && (
                <TextButton
                  size="medium"
                  variant="outlined"
                  className="h-11.75"
                  onClick={onCreateFormClick}
                >
                  {formActionLabel}
                </TextButton>
              )}
              {!isLeader && (
                <TextButton
                  size="wide"
                  variant={applyVariant}
                  onClick={applyVariant === "filled" ? onApplyClick : undefined}
                >
                  동아리 신청하기
                </TextButton>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
