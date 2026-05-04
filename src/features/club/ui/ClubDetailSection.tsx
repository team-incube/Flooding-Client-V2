"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { notFound, useRouter } from "next/navigation";
import Club from "@/shared/asset/svg/Club";
import ClubDetail from "@/entities/club/ui/ClubDetail";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import type { ClubMember } from "@/entities/club/model/club";
import type { SearchUser } from "@/entities/user/model/user";
import { useApplyAutonomousClub } from "../model/useApplyAutonomousClub";
import { useTransferClubLeader } from "../model/useTransferClubLeader";
import { useInviteClubMember } from "../model/useInviteClubMember";
import { useExileClubMember } from "../model/useExileClubMember";
import { ClubTransferModal } from "./ClubTransferModal";

interface ClubDetailSectionProps {
  id: number;
}

const SEARCH_RESULT_LIMIT = 5;

export function ClubDetailSection({ id }: ClubDetailSectionProps) {
  if (!Number.isInteger(id)) {
    notFound();
  }

  const router = useRouter();
  const autonomousApplyMutation = useApplyAutonomousClub(id);
  const transferMutation = useTransferClubLeader(id);
  const inviteMutation = useInviteClubMember(id);
  const exileMutation = useExileClubMember(id);

  const [transferTarget, setTransferTarget] = useState<ClubMember | null>(null);
  const [memberSearch, setMemberSearch] = useState("");

  const { data: detail, isLoading, isError, error } = useQuery(clubQueries.detail(id));
  const { data: user, isLoading: isUserLoading } = useQuery(userQueries.me());
  const isLeader = !!user && (
    detail?.club.leaderId !== undefined
      ? user.id === detail.club.leaderId
      : user.name === detail?.club.leader
  );
  const canCreateForm = detail?.club.type === "MAJOR_CLUB" && isLeader;
  const canViewApplications =
    !!detail &&
    (isLeader ||
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

  const trimmedSearch = memberSearch.trim();
  const { data: searchUsersPage } = useQuery({
    ...userQueries.list({ name: trimmedSearch || undefined }),
    enabled: isLeader && trimmedSearch.length > 0,
  });
  const memberIds = new Set((detail?.members ?? []).map((m) => m.id));
  const memberSearchResults = (searchUsersPage?.content ?? [])
    .filter((u) => u.id !== user?.id && !memberIds.has(u.id))
    .slice(0, SEARCH_RESULT_LIMIT);

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

  const handleMemberInvite = (invitedUser: SearchUser) => {
    inviteMutation.mutate(invitedUser.id, {
      onSuccess: () => setMemberSearch(""),
    });
  };

  const handleMemberExile = (memberId: number) => {
    exileMutation.mutate(memberId);
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
    const isForbidden =
      axios.isAxiosError(error) &&
      error.response?.status === HttpStatusCode.Forbidden;

    if (isForbidden) {
      return (
        <div className="flex min-h-0 flex-1 w-full items-center justify-center xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-title-3 text-main-text">접근 권한이 없어요</span>
            <span className="text-text-2 text-sub-1">이 동아리 정보를 볼 수 있는 권한이 없습니다.</span>
          </div>
        </div>
      );
    }

    notFound();
  }

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
              onEditClick={isLeader ? () => {} : undefined}
              memberSearchQuery={memberSearch}
              memberSearchResults={memberSearchResults}
              onMemberSearchChange={setMemberSearch}
              onMemberInvite={isLeader ? handleMemberInvite : undefined}
              onMemberExile={isLeader ? handleMemberExile : undefined}
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
}
