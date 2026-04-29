"use client";

import { useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { notFound, useRouter } from "next/navigation";
import Club from "@/shared/asset/svg/Club";
import ClubDetail from "@/entities/club/ui/ClubDetail";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import type { ClubMember } from "@/entities/club/model/club";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useApplyAutonomousClub } from "../model/useApplyAutonomousClub";
import { useTransferClubLeader } from "../model/useTransferClubLeader";
import { ClubTransferModal } from "./ClubTransferModal";

interface ClubDetailSectionProps {
  id: number;
}

function ClubDetailSectionLoading() {
  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
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
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-background-surface p-6">
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

const ClubDetailSection = ({ id }: ClubDetailSectionProps) => {
  if (!Number.isInteger(id)) {
    notFound();
  }

  const router = useRouter();
  const autonomousApplyMutation = useApplyAutonomousClub(id);
  const transferMutation = useTransferClubLeader(id);
  const [transferTarget, setTransferTarget] = useState<ClubMember | null>(null);
  const { data: detail } = useSuspenseQuery(clubQueries.detail(id));
  const { data: user } = useSuspenseQuery(userQueries.me());
  const isLeader = !!user && user.name === detail?.club.leader;
  const canCreateForm = detail?.club.type === "MAJOR_CLUB" && isLeader;
  const canViewApplications =
    !!detail &&
    (isLeader || user?.role === "ADMIN" || user?.role === "STUDENT_COUNCIL");
  const formQuery = clubQueries.form(id);
  const { data: form, error: formError } = useQuery({
    ...formQuery,
    enabled: canCreateForm,
    retry: false,
  });

  const handleApplyClick = () => {
    if (!detail || autonomousApplyMutation.isPending) {
      return;
    }

    if (detail.club.type === "AUTONOMOUS_CLUB") {
      autonomousApplyMutation.mutate();
      return;
    }

    router.push(`/club/${detail.club.id}/apply`);
  };

  const handleCreateFormClick = () => {
    if (!detail) {
      return;
    }

    router.push(`/club/${detail.club.id}/forms/new`);
  };

  const handleEditFormClick = () => {
    if (!detail) {
      return;
    }

    router.push(`/club/${detail.club.id}/forms/edit`);
  };

  const handleApplicationsClick = () => {
    if (!detail) {
      return;
    }

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
  const canShowFormAction = canCreateForm && (hasForm || hasNoForm);

  return (
    <>
      <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
        <div className="flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
          <div className="flex items-center gap-2">
            <Club isActive={false} size={20} />
            <span className="text-text-1 text-main-text">동아리</span>
          </div>
          <div className="w-full">
            <ClubDetail
              detail={detail}
              isLeader={isLeader}
              isApplyPending={autonomousApplyMutation.isPending}
              onApplyClick={handleApplyClick}
              formActionLabel={hasForm ? "폼 수정하기" : "폼 만들기"}
              onViewApplicationsClick={
                canViewApplications ? handleApplicationsClick : undefined
              }
              onCreateFormClick={
                canShowFormAction
                  ? hasForm
                    ? handleEditFormClick
                    : handleCreateFormClick
                  : undefined
              }
              onTransferClick={isLeader ? handleTransferClick : undefined}
            />
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

function ClubDetailSectionBoundary({ id }: ClubDetailSectionProps) {
  return (
    <ClientQueryBoundary
      loadingFallback={<ClubDetailSection.Loading />}
      errorFallback={ClubDetailSection.Error}
    >
      <ClubDetailSection id={id} />
    </ClientQueryBoundary>
  );
}

export { ClubDetailSection, ClubDetailSectionBoundary };
