"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import Club from "@/shared/asset/svg/Club";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { useApproveClubApplication } from "../model/useApproveClubApplication";

interface ClubApplicationListSectionProps {
  id: number;
}

const submittedAtPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/;

function formatSubmittedAt(value: string) {
  if (!submittedAtPattern.test(value)) {
    return value;
  }

  const hasTimeZone = /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
  const date = new Date(hasTimeZone ? value : `${value}+09:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function getErrorMessage(error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;

  if (status === HttpStatusCode.BadRequest) {
    return "정규 동아리만 신청자 목록을 조회할 수 있어요.";
  }
  if (status === HttpStatusCode.Forbidden) {
    return "신청자 목록을 조회할 권한이 없어요.";
  }
  if (status === HttpStatusCode.NotFound) {
    return "동아리 또는 신청 폼을 찾을 수 없어요.";
  }

  return "신청자 목록을 불러오지 못했어요.";
}

export function ClubApplicationListSection({
  id,
}: ClubApplicationListSectionProps) {
  const approveMutation = useApproveClubApplication(id);
  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useQuery(clubQueries.detail(id));
  const { data: user, isLoading: isUserLoading } = useQuery(userQueries.me());
  const isLeader = !!user && user.name === detail?.club.leader;
  const canViewApplications =
    !!detail &&
    (isLeader || user?.role === "ADMIN" || user?.role === "STUDENT_COUNCIL");
  const {
    data: applicationList,
    isLoading: isApplicationLoading,
    isError: isApplicationError,
    error,
  } = useQuery({
    ...clubQueries.applicationList(id),
    enabled: canViewApplications,
  });

  if (
    isDetailLoading ||
    isUserLoading ||
    (canViewApplications && isApplicationLoading)
  ) {
    return (
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
          <div className="bg-sub-4 h-6 w-32 animate-pulse rounded" />
          <div className="bg-sub-4 h-5 w-48 animate-pulse rounded" />
          <div className="flex flex-col gap-4">
            <div className="bg-sub-4 h-[180px] w-full animate-pulse rounded-xl" />
            <div className="bg-sub-4 h-[180px] w-full animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (
    isDetailError ||
    !detail ||
    !canViewApplications ||
    isApplicationError ||
    !applicationList
  ) {
    return (
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
          <Club isActive={false} size={32} />
          <p className="text-text-1 text-main-text text-center">
            {isDetailError || !detail
              ? "존재하지 않는 동아리입니다."
              : !canViewApplications
                ? "신청자 목록을 조회할 권한이 없어요."
                : getErrorMessage(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
        <div className="flex items-center gap-2">
          <Club isActive={false} size={20} />
          <span className="text-text-1 text-main-text">동아리 신청자 목록</span>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-title-2 text-main-text">{detail.club.name}</h1>
          <p className="text-text-3 text-sub-1">
            총 {applicationList.applications.length}명의 신청자가 있어요.
          </p>
        </div>

        {applicationList.applications.length === 0 ? (
          <div className="border-sub-3 bg-background flex h-[320px] items-center justify-center rounded-2xl border border-dashed">
            <p className="text-text-2 text-sub-1">아직 신청자가 없어요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {applicationList.applications.map((application, index) => (
              <article
                key={application.submissionId}
                className="border-sub-3 bg-background flex flex-col gap-5 rounded-2xl border p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-caption-1 text-sub-1">
                      신청 {index + 1}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-text-1 text-main-text">
                        {application.applicant.name}
                      </span>
                      <span className="text-text-3 text-sub-1">
                        {application.applicant.studentNumber}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-caption-1 text-sub-1">
                      {formatSubmittedAt(application.submittedAt)}
                    </span>
                    <TextButton
                      variant={
                        approveMutation.isPending ? "disabled" : "filled"
                      }
                      size="small"
                      onClick={() =>
                        approveMutation.mutate({
                          userId: application.applicant.id,
                        })
                      }
                    >
                      승인
                    </TextButton>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  {application.answers.map((answer) => (
                    <div
                      key={`${application.submissionId}-${answer.fieldId}`}
                      className="bg-background-surface flex flex-col gap-1 rounded-xl p-4"
                    >
                      <span className="text-caption-1 text-sub-1">
                        {answer.label}
                      </span>
                      <p className="text-text-3 text-main-text wrap-break-word">
                        {answer.value?.trim() || "미입력"}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
