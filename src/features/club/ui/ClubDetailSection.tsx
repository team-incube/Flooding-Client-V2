"use client";

import { useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import Club from "@/shared/asset/svg/Club";
import ClubDetail from "@/entities/club/ui/ClubDetail";
import {
  clubQueries,
  usePatchClubApproval,
} from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import type { ClubMember } from "@/entities/club/model/club";
import type { SearchUser } from "@/entities/user/model/user";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useApplyAutonomousClub } from "../model/useApplyAutonomousClub";
import { useTransferClubLeader } from "../model/useTransferClubLeader";
import { useInviteClubMember } from "../model/useInviteClubMember";
import { useExileClubMember } from "../model/useExileClubMember";
import { ClubTransferModal } from "./ClubTransferModal";

interface ClubDetailSectionProps {
  id: number;
  isPending?: boolean;
}

const SEARCH_RESULT_LIMIT = 5;

function ClubDetailSectionLoading() {
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

function ClubDetailSectionError({
  error,
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  const isForbidden =
    axios.isAxiosError(error) &&
    error.response?.status === HttpStatusCode.Forbidden;

  if (isForbidden) {
    return (
      <div className="flex min-h-0 w-full flex-1 items-center justify-center sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-title-3 text-main-text">
            접근 권한이 없어요
          </span>
          <span className="text-text-2 text-sub-1">
            이 동아리 정보를 볼 수 있는 권한이 없습니다.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
        <Club isActive={false} size={32} />
        <p className="text-text-1 text-main-text">
          동아리 정보를 불러오지 못했어요.
        </p>
        <TextButton variant="outlined" size="fit" onClick={resetErrorBoundary}>
          다시 시도
        </TextButton>
      </div>
    </div>
  );
}

const ClubDetailSection = ({
  id,
  isPending = false,
}: ClubDetailSectionProps) => {
  if (!Number.isInteger(id)) {
    notFound();
  }

  const router = useRouter();
  const autonomousApplyMutation = useApplyAutonomousClub(id);
  const transferMutation = useTransferClubLeader(id);
  const { mutate: patchApproval, isPending: isApprovalPending } =
    usePatchClubApproval();
  const inviteMutation = useInviteClubMember(id);
  const exileMutation = useExileClubMember(id);
  const [transferTarget, setTransferTarget] = useState<ClubMember | null>(null);
  const [memberSearch, setMemberSearch] = useState("");

  const { data: detail } = useSuspenseQuery(clubQueries.detail(id));
  const { data: user } = useSuspenseQuery(userQueries.me());
  const { data: isRegistrationPeriod = false } = useSuspenseQuery(
    clubQueries.openingStatus(),
  );

  const isLeader = detail.isLeader;
  const isManager = user.role === "ADMIN" || user.role === "STUDENT_COUNCIL";
  const canDeleteClub =
    (isLeader || user.role === "ADMIN") && isRegistrationPeriod;
  const canCreateForm = detail.club.type === "MAJOR_CLUB" && isLeader;
  const canViewApplications = isLeader || isManager;
  const formQuery = clubQueries.form(id);
  const { data: form, error: formError } = useQuery({
    ...formQuery,
    enabled: canCreateForm,
    retry: false,
  });

  const trimmedSearch = memberSearch.trim();
  const { data: searchUsersPage } = useQuery({
    ...userQueries.list({ name: trimmedSearch || undefined }),
    enabled: isLeader && trimmedSearch.length > 0,
  });
  const memberIds = new Set(detail.members.map((member) => member.id));
  const memberSearchResults = (searchUsersPage?.content ?? [])
    .filter(
      (searchUser) =>
        searchUser.id !== user.id && !memberIds.has(searchUser.id),
    )
    .slice(0, SEARCH_RESULT_LIMIT);

  const handleApplyClick = () => {
    if (autonomousApplyMutation.isPending) {
      return;
    }

    if (detail.club.type === "AUTONOMOUS_CLUB") {
      autonomousApplyMutation.mutate();
      return;
    }

    router.push(`/club/${detail.club.id}/apply`);
  };

  const handleCreateFormClick = () => {
    router.push(`/club/${detail.club.id}/forms/new`);
  };

  const handleEditFormClick = () => {
    router.push(`/club/${detail.club.id}/forms/edit`);
  };

  const handleApplicationsClick = () => {
    router.push(`/club/${detail.club.id}/applications`);
  };

  const handleTransferClick = (member: ClubMember) => {
    setTransferTarget(member);
  };

  const handleTransferConfirm = () => {
    if (!transferTarget) return;
    transferMutation.mutate(transferTarget.id, {
      onSuccess: () => setTransferTarget(null),
    });
  };

  const handleTransferClose = () => {
    setTransferTarget(null);
  };

  const handleMemberInvite = (invitedUser: SearchUser) => {
    inviteMutation.mutate(invitedUser.id, {
      onSuccess: () => setMemberSearch(""),
    });
  };

  const handleMemberExile = (memberId: number) => {
    exileMutation.mutate(memberId);
  };

  const hasForm = !!form;
  const hasNoForm =
    axios.isAxiosError(formError) &&
    formError.response?.status === HttpStatusCode.NotFound;
  const canShowFormAction = canCreateForm && (hasForm || hasNoForm);

  return (
    <>
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Club isActive={false} size={20} />
            <span className="text-text-1 text-main-text">동아리</span>
          </div>
          <div className="flex w-full flex-col gap-4">
            <ClubDetail
              detail={detail}
              canDelete={canDeleteClub}
              isApplyPending={autonomousApplyMutation.isPending}
              onApplyClick={
                isPending || isManager ? undefined : handleApplyClick
              }
              formActionLabel={hasForm ? "폼 수정하기" : "폼 만들기"}
              onViewApplicationsClick={
                !isPending && canViewApplications
                  ? handleApplicationsClick
                  : undefined
              }
              onCreateFormClick={
                canShowFormAction
                  ? hasForm
                    ? handleEditFormClick
                    : handleCreateFormClick
                  : undefined
              }
              onTransferClick={isLeader ? handleTransferClick : undefined}
              onEditClick={isLeader ? () => {} : undefined}
              memberSearchQuery={memberSearch}
              memberSearchResults={memberSearchResults}
              onMemberSearchChange={setMemberSearch}
              onMemberInvite={isLeader ? handleMemberInvite : undefined}
              onMemberExile={isLeader ? handleMemberExile : undefined}
            />
            {isManager && isPending && (
              <div className="flex justify-end">
                <div className="flex w-[240px] gap-2">
                  <TextButton
                    size="fit"
                    className="flex-1"
                    variant="negative"
                    onClick={() =>
                      patchApproval(
                        { clubId: id, body: { approved: false } },
                        {
                          onSuccess: () => {
                            toast.success("동아리 개설을 거부했습니다.");
                            router.push("/club");
                          },
                          onError: () => toast.error("처리에 실패했습니다."),
                        },
                      )
                    }
                    disabled={isApprovalPending}
                  >
                    개설 거부
                  </TextButton>
                  <TextButton
                    size="fit"
                    className="flex-1"
                    variant="filled"
                    onClick={() =>
                      patchApproval(
                        { clubId: id, body: { approved: true } },
                        {
                          onSuccess: () =>
                            toast.success("동아리 개설을 승인했습니다."),
                          onError: () => toast.error("처리에 실패했습니다."),
                        },
                      )
                    }
                    disabled={isApprovalPending}
                  >
                    개설 승인
                  </TextButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ClubTransferModal
        open={transferTarget !== null}
        targetMember={transferTarget}
        isPending={transferMutation.isPending}
        onClose={handleTransferClose}
        onConfirm={handleTransferConfirm}
      />
    </>
  );
};

ClubDetailSection.Loading = ClubDetailSectionLoading;
ClubDetailSection.Error = ClubDetailSectionError;

function ClubDetailSectionBoundary({ id, isPending }: ClubDetailSectionProps) {
  return (
    <ClientQueryBoundary
      loadingFallback={<ClubDetailSection.Loading />}
      errorFallback={ClubDetailSection.Error}
    >
      <ClubDetailSection id={id} isPending={isPending} />
    </ClientQueryBoundary>
  );
}

export { ClubDetailSection, ClubDetailSectionBoundary };
