"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { notFound, useRouter } from "next/navigation";
import Club from "@/shared/asset/svg/Club";
import ClubDetail from "@/entities/club/ui/ClubDetail";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { useApplyAutonomousClub } from "../model/useApplyAutonomousClub";
import { isRegistrationPeriod } from "../config";

interface ClubDetailSectionProps {
  id: number;
}

export function ClubDetailSection({ id }: ClubDetailSectionProps) {
  if (!Number.isInteger(id)) {
    notFound();
  }

  const router = useRouter();
  const autonomousApplyMutation = useApplyAutonomousClub(id);
  const { data: detail, isLoading, isError } = useQuery(clubQueries.detail(id));
  const { data: user, isLoading: isUserLoading } = useQuery(userQueries.me());

  const canDeleteClub =
    (detail?.isLeader || user?.role === "ADMIN") && isRegistrationPeriod;
  const canCreateForm =
    detail?.club.type === "MAJOR_CLUB" && detail.isLeader;
  const canViewApplications =
    !!detail &&
    (detail.isLeader ||
      user?.role === "ADMIN" ||
      user?.role === "STUDENT_COUNCIL");
  const formQuery = clubQueries.form(id);
  const {
    data: form,
    error: formError,
  } = useQuery({
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

  if (isLoading || isUserLoading) {
    return (
      <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
        <div className="flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded bg-sub-4" />
            <div className="h-5 w-16 animate-pulse rounded bg-sub-4" />
          </div>
          <div className="h-40 w-full animate-pulse rounded-xl bg-sub-4" />
          <div className="h-6 w-32 animate-pulse rounded bg-sub-4" />
          <div className="h-24 w-full animate-pulse rounded-xl bg-sub-4" />
        </div>
      </div>
    );
  }

  if (isError || !detail) {
    notFound();
  }

  const hasForm = !!form;
  const hasNoForm =
    axios.isAxiosError(formError) &&
    formError.response?.status === HttpStatusCode.NotFound;
  const canShowFormAction = canCreateForm && (hasForm || hasNoForm);

  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center gap-2">
          <Club isActive={false} size={20} />
          <span className="text-text-1 text-main-text">동아리</span>
        </div>
        <div className="w-full">
          <ClubDetail
            detail={detail}
            canDelete={canDeleteClub}
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
          />
        </div>
      </div>
    </div>
  );
}
