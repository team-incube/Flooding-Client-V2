"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ClubThumbnail } from "@/entities/club/ui/ClubThumbnail";
import { ClubActionButtons } from "@/entities/club/ui/ClubActionButtons";
import Edit from "@/shared/asset/svg/Edit";
import Search from "@/shared/asset/svg/Search";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";
import { SelectedStudent } from "@/entities/user/ui/SelectedStudent";
import ClubMemberList from "./ClubMemberList";
import ProjectCard from "./ProjectCard";
import { User } from "@/entities/user/model/user";
import type { ClubMember } from "../model/club";
import { ClubDetailResponse, Project } from "../model/club";
import { usePutClub, useDeleteClub } from "../api/clubQueries";
import FileOff from "@/shared/asset/svg/FileOff";

interface ClubDetailProps {
  detail: ClubDetailResponse;
  isApplyPending?: boolean;
  onApplyClick?: () => void;
  onViewApplicationsClick?: () => void;
  onCreateFormClick?: () => void;
  onTransferClick?: (member: ClubMember) => void;
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
  formActionLabel = "폼 만들기",
  canDelete = false,
}: ClubDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { club, members, projects, isLeader } = detail;

  const [isEdit, setIsEdit] = useState(false);
  const [description, setDescription] = useState(club.description ?? "");
  const [previewUrl, setPreviewUrl] = useState(club.imageUrl ?? "");
  const [selectedStudents, setSelectedStudents] = useState<User[]>([]);
  const [searchName, setSearchName] = useState("");

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
                <TextField
                  placeholder="이름, 학번을 입력해주세요"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  rightIcon={<Search />}
                />
              </div>
              <SelectedStudent
                selectedStudents={selectedStudents}
                onRemoveStudent={(num) =>
                  setSelectedStudents((p) =>
                    p.filter((s) => s.studentNumber !== num),
                  )
                }
              />
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

        <div className="flex flex-col items-end">
          {!isEdit && isLeader && (
            <button
              onClick={() => setIsEdit(true)}
              className="p-2 rounded-lg bg-sub-4 cursor-pointer"
            >
              <Edit color="var(--color-sub-1)" />
            </button>
          )}

          <div className="flex flex-wrap justify-end gap-2">
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

            {!isEdit && !isLeader && (
              <>
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
                  variant={
                    isApplyPending || !onApplyClick ? "disabled" : "filled"
                  }
                  onClick={onApplyClick}
                >
                  동아리 신청하기
                </TextButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
