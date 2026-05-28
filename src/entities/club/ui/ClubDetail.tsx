"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import {
  usePutClub,
  useDeleteClub,
  useUploadClubRepresentativeImage,
} from "../api/clubQueries";
import { clubMemberMutations } from "@/entities/club-member/api/clubMemberMutations";
import FileOff from "@/shared/asset/svg/FileOff";

const SEARCH_RESULT_LIMIT = 5;

interface ClubDetailProps {
  detail: ClubDetailResponse;
  isApplyPending?: boolean;
  applyDisabledMessage?: string;
  onApplyClick?: () => void;
  onViewApplicationsClick?: () => void;
  onCreateFormClick?: () => void;
  onTransferClick?: (member: ClubMember) => void;
  memberSearchQuery?: string;
  memberSearchResults?: SearchUser[];
  onMemberSearchChange?: (query: string) => void;
  formActionLabel?: string;
  canDelete?: boolean;
}

export default function ClubDetail({
  detail,
  isApplyPending = false,
  applyDisabledMessage,
  onApplyClick,
  onViewApplicationsClick,
  onCreateFormClick,
  onTransferClick,
  memberSearchQuery = "",
  memberSearchResults = [],
  onMemberSearchChange,
  formActionLabel = "폼 만들기",
  canDelete = false,
}: ClubDetailProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { club, members, projects, isLeader } = detail;

  const isEdit = searchParams.has("edit");
  const [description, setDescription] = useState(club.description ?? "");
  const [previewUrl, setPreviewUrl] = useState(club.imageUrl ?? "");
  const [representativeImage, setRepresentativeImage] = useState<File | null>(
    null,
  );
  const [editableMembers, setEditableMembers] = useState<ClubMember[]>(members);

  const originalMemberIds = new Set(members.map((m) => m.id));
  const nextMemberIds = new Set(editableMembers.map((m) => m.id));
  const invitedMembers = editableMembers.filter(
    (m) => !originalMemberIds.has(m.id),
  );
  const exiledMembers = members.filter(
    (m) =>
      !nextMemberIds.has(m.id) &&
      (club.leaderId !== undefined
        ? m.id !== club.leaderId
        : m.name !== club.leader),
  );

  const changeSummary: string[] = [];
  if (description !== (club.description ?? "")) changeSummary.push("소개 수정");
  if (representativeImage !== null) changeSummary.push("대표 이미지 변경");
  if (invitedMembers.length > 0)
    changeSummary.push(
      `멤버 ${invitedMembers.length}명 추가 (${invitedMembers.map((m) => m.name).join(", ")})`,
    );
  if (exiledMembers.length > 0)
    changeSummary.push(
      `멤버 ${exiledMembers.length}명 제외 (${exiledMembers.map((m) => m.name).join(", ")})`,
    );

  const applyVariant =
    isApplyPending || !onApplyClick || applyDisabledMessage
      ? "disabled"
      : "filled";
  const shouldShowApplyButton =
    !isLeader && (!!onApplyClick || !!applyDisabledMessage);
  const nonLeaderMembers = editableMembers.filter((m) =>
    club.leaderId !== undefined
      ? m.id !== club.leaderId
      : m.name !== club.leader,
  );
  const editableMemberIds = new Set(editableMembers.map((member) => member.id));
  const filteredMemberSearchResults = memberSearchResults
    .filter((user) => !editableMemberIds.has(user.id))
    .slice(0, SEARCH_RESULT_LIMIT);

  const { mutateAsync: updateClub } = usePutClub();
  const { mutateAsync: deleteClub } = useDeleteClub();
  const { mutateAsync: uploadRepresentativeImage } =
    useUploadClubRepresentativeImage();

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleEditStart = () => {
    setDescription(club.description ?? "");
    setRepresentativeImage(null);
    setPreviewUrl(club.imageUrl ?? "");
    setEditableMembers(members);
    router.replace(`${pathname}?edit`);
  };

  const handleMemberInvite = (user: SearchUser) => {
    setEditableMembers((currentMembers) => {
      if (currentMembers.some((member) => member.id === user.id)) {
        return currentMembers;
      }

      return [
        ...currentMembers,
        {
          id: user.id,
          name: user.name,
          studentNumber: user.studentNumber,
          sex: user.sex,
          specialty: "",
        },
      ];
    });
    onMemberSearchChange?.("");
  };

  const handleMemberExile = (memberId: number) => {
    const isCurrentLeader =
      club.leaderId !== undefined
        ? memberId === club.leaderId
        : editableMembers.find((member) => member.id === memberId)?.name ===
          club.leader;

    if (isCurrentLeader) {
      return;
    }

    setEditableMembers((currentMembers) =>
      currentMembers.filter((member) => member.id !== memberId),
    );
  };

  const handleSave = () => {
    const promise = (async () => {
      const uploadedImageUrl = representativeImage
        ? (await uploadRepresentativeImage(representativeImage)).imageUrl
        : previewUrl;

      if (representativeImage) {
        setPreviewUrl(uploadedImageUrl);
      }

      await updateClub({
        clubId: club.id,
        body: {
          name: club.name,
          description,
          imageUrl: uploadedImageUrl,
          maxMember: club.maxMember,
        },
      });

      await Promise.all([
        ...invitedMembers.map((m) => clubMemberMutations.invite(club.id, m.id)),
        ...exiledMembers.map((m) => clubMemberMutations.exile(club.id, m.id)),
      ]);
    })();

    toast.promise(promise, {
      loading: "저장 중...",
      success: () => {
        setRepresentativeImage(null);
        setEditableMembers(members);
        onMemberSearchChange?.("");
        router.replace(pathname);
        queryClient.invalidateQueries({ queryKey: ["club"] });
        queryClient.invalidateQueries({
          queryKey: ["club", "detail", club.id],
        });
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
      <div className="flex w-full flex-col gap-6 lg:w-100 2xl:w-121">
        <ClubThumbnail
          imageUrl={isEdit ? previewUrl : club.imageUrl}
          isEdit={isEdit}
          onImageChange={(file) => {
            if (previewUrl.startsWith("blob:")) {
              URL.revokeObjectURL(previewUrl);
            }
            setRepresentativeImage(file);
            setPreviewUrl(URL.createObjectURL(file));
          }}
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="2xl:text-title-1 lg:text-title-2 text-main-text font-bold">
              {club.name}
            </span>
            <span className="bg-p-1 text-caption-1 shrink-0 rounded-md px-2 py-0.5 text-white">
              {club.type === "MAJOR_CLUB" ? "전공" : "자율"}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="2xl:text-title-4 lg:text-text-1 text-main-text font-semibold">
              동아리 소개
            </span>
            {isEdit ? (
              <div className="flex flex-col gap-1">
                <textarea
                  className="text-text-1 text-sub-1 border-sub-2 bg-background-surface focus:border-sub-1 w-full resize-none rounded-lg border p-4 outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <span className="text-sub-2 text-right text-xs">
                  {description.length}/500
                </span>
              </div>
            ) : (
              <p className="2xl:text-text-1 lg:text-text-2 text-sub-1 leading-relaxed whitespace-pre-wrap">
                {club.description}
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
                members={editableMembers}
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
                  {filteredMemberSearchResults.length > 0 &&
                    memberSearchQuery.trim() && (
                      <div className="border-sub-4 bg-background-surface absolute z-10 mt-1 w-full overflow-hidden rounded-lg border shadow-md">
                        <div className="divide-sub-4 flex flex-col divide-y px-2">
                          {filteredMemberSearchResults.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleMemberInvite(user)}
                              className="text-text-2 text-main-text hover:bg-sub-4 w-full px-2 py-3 text-left"
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
                      className="border-sub-2 bg-background-surface text-caption-1 2xl:text-text-2 text-main-text flex items-center justify-center gap-1.5 rounded-[38px] border px-3 py-1.5 lg:gap-2 lg:px-4 lg:py-2 2xl:px-6 2xl:py-3"
                    >
                      <span className="whitespace-nowrap">
                        {member.studentNumber} {member.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMemberExile(member.id)}
                        className="text-sub-2 hover:text-negative flex shrink-0 items-center [&>svg]:h-3 [&>svg]:w-3 2xl:[&>svg]:h-3.5 2xl:[&>svg]:w-3.5"
                        aria-label={`${member.name} 추방`}
                      >
                        <Cancel />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 xl:self-stretch">
        <div className="flex h-full flex-col gap-4">
          <span className="text-text-1 text-main-text">동아리 프로젝트</span>
          {projects.length > 0 ? (
            projects.map((p: Project) => (
              <ProjectCard key={p.id} project={p} leader={club.leader} />
            ))
          ) : (
            <div className="flex min-h-60 flex-1 flex-col items-center justify-center gap-2">
              <FileOff />
              <p className="text-text-3 text-sub-2">
                등록된 프로젝트가 없어요!
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {!isEdit && isLeader && (
            <button
              type="button"
              onClick={handleEditStart}
              className="bg-sub-4 flex cursor-pointer items-center justify-center rounded-xl p-2.5"
              aria-label="동아리 수정"
            >
              <Edit />
            </button>
          )}
          <ClubActionButtons
            isEdit={isEdit}
            canDelete={canDelete}
            onSave={handleSave}
            onDelete={handleDelete}
            changeSummary={changeSummary}
          />
          {!isEdit && (
            <>
              {onViewApplicationsClick && (
                <TextButton
                  size="fit"
                  variant="outlined"
                  className="min-w-[147px]"
                  onClick={onViewApplicationsClick}
                >
                  신청자 목록
                </TextButton>
              )}
              {onCreateFormClick && (
                <TextButton
                  size="fit"
                  variant="outlined"
                  onClick={onCreateFormClick}
                >
                  {formActionLabel}
                </TextButton>
              )}
              {shouldShowApplyButton && (
                <TextButton
                  size="wide"
                  variant={applyVariant}
                  onClick={applyVariant === "filled" ? onApplyClick : undefined}
                >
                  {applyDisabledMessage ? "신청 불가" : "동아리 신청하기"}
                </TextButton>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
