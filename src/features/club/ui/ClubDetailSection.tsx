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
import { createClubPermission } from "@/entities/club/lib/permission";
import type { ClubMember } from "@/entities/club/model/club";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useApplyAutonomousClub } from "../model/useApplyAutonomousClub";
import { useTransferClubLeader } from "../model/useTransferClubLeader";
import { ClubBackButton } from "./ClubBackButton";
import { ClubTransferModal } from "./ClubTransferModal";

interface ClubDetailSectionProps {
  id: number;
  isPending?: boolean;
}

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
  const [transferTarget, setTransferTarget] = useState<ClubMember | null>(null);
  const [memberSearch, setMemberSearch] = useState("");

  const { data: detail } = useSuspenseQuery(clubQueries.detail(id));
  const { data: user } = useSuspenseQuery(userQueries.me());
  const baseClubPermission = createClubPermission({ role: user.role });
  const canCheckOpeningStatus = baseClubPermission.canCheckOpeningStatus;
  const { data: openingStatus } = useQuery({
    ...clubQueries.openingStatus(),
    enabled: canCheckOpeningStatus,
    retry: false,
  });

  const isLeader = detail.isLeader;
  const clubPermission = createClubPermission({
    role: user.role,
    clubType: detail.club.type,
    isLeader,
    isOpeningApplicationOpen: openingStatus?.isOpened,
  });
  const hasClubApplication = user.hasClubApplication ?? false;
  const formQuery = clubQueries.form(id);
  const { data: form, error: formError } = useQuery({
    ...formQuery,
    enabled: clubPermission.canCreateForm,
    retry: false,
  });

  const trimmedSearch = memberSearch.trim();
  const { data: searchUsersPage } = useQuery({
    ...userQueries.list({ name: trimmedSearch || undefined }),
    enabled: isLeader && trimmedSearch.length > 0,
  });
  const memberSearchResults = (searchUsersPage?.content ?? []).filter(
    (searchUser) => searchUser.id !== user.id,
  );

  const handleApplyClick = () => {
    if (autonomousApplyMutation.isPending || hasClubApplication) {
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

  const hasForm = !!form;
  const hasNoForm =
    axios.isAxiosError(formError) &&
    formError.response?.status === HttpStatusCode.NotFound;
  const canShowFormAction =
    clubPermission.canCreateForm && (hasForm || hasNoForm);

  return (
    <>
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <ClubBackButton />
            <span className="text-text-1 text-main-text">동아리</span>
          </div>
          <div className="flex w-full flex-col gap-4">
            <ClubDetail
              detail={detail}
              canDelete={clubPermission.canDelete}
              isApplyPending={autonomousApplyMutation.isPending}
              applyDisabledMessage={
                hasClubApplication
                  ? "동아리 신청은 1인 1회 신청입니다"
                  : undefined
              }
              onApplyClick={
                isPending || clubPermission.isManager || hasClubApplication
                  ? undefined
                  : handleApplyClick
              }
              formActionLabel={hasForm ? "폼 수정하기" : "폼 만들기"}
              onViewApplicationsClick={
                !isPending && clubPermission.canViewApplications
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
              onTransferClick={
                clubPermission.canTransferLeader
                  ? handleTransferClick
                  : undefined
              }
              onEditClick={clubPermission.canEditClub ? () => {} : undefined}
              memberSearchQuery={memberSearch}
              memberSearchResults={memberSearchResults}
              onMemberSearchChange={setMemberSearch}
            />
            {clubPermission.isManager && isPending && (
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
