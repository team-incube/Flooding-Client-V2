"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";
import Club from "@/shared/asset/svg/Club";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { formatDateParam } from "@/shared/lib/date";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { useApproveClubApplication } from "../model/useApproveClubApplication";
import { ClubBackButton } from "./ClubBackButton";

interface ClubApplicationListSectionProps {
  id: number;
}

function formatSubmittedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return formatDateParam(date, { hour: true, minute: true }).replaceAll(
    "-",
    ".",
  );
}

function getErrorMessage(error: unknown) {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;

  if (status === HttpStatusCode.BadRequest) {
    return "전공 동아리만 신청자 목록을 조회할 수 있어요.";
  }
  if (status === HttpStatusCode.Forbidden) {
    return "신청자 목록을 조회할 권한이 없어요.";
  }
  if (status === HttpStatusCode.NotFound) {
    return "신청자 목록을 찾을 수 없어요.";
  }

  return "신청자 목록을 불러오지 못했어요.";
}

const ClubApplicationListSection = ({
  id,
}: ClubApplicationListSectionProps) => {
  return <ClubApplicationListContent id={id} />;
};

function ClubApplicationListSectionLoading() {
  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-48" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[180px] w-full rounded-xl" />
          <Skeleton className="h-[180px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ClubApplicationListSectionError({
  error,
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
        <Club isActive={false} size={32} />
        <p className="text-text-1 text-main-text text-center">
          {getErrorMessage(error)}
        </p>
        <div className="flex gap-3">
          <TextButton
            variant="outlined"
            size="fit"
            onClick={() => router.back()}
          >
            뒤로가기
          </TextButton>
          <TextButton
            variant="outlined"
            size="fit"
            onClick={resetErrorBoundary}
          >
            다시 시도
          </TextButton>
        </div>
      </div>
    </div>
  );
}

function ClubApplicationListSectionEmpty() {
  return (
    <div className="border-sub-3 bg-background flex h-[320px] items-center justify-center rounded-2xl border border-dashed">
      <p className="text-text-2 text-sub-1">아직 신청자가 없어요.</p>
    </div>
  );
}

function ClubApplicationListContent({ id }: ClubApplicationListSectionProps) {
  const approveMutation = useApproveClubApplication(id);
  const { data: detail } = useSuspenseQuery(clubQueries.detail(id));
  const { data: user } = useSuspenseQuery(userQueries.me());
  const isLeader = !!user && user.name === detail?.club.leader;
  const canApproveApplications = isLeader || user?.role === "ADMIN";
  const canViewApplications =
    !!detail &&
    detail.club.type === "MAJOR_CLUB" &&
    (isLeader || user?.role === "ADMIN" || user?.role === "STUDENT_COUNCIL");
  const applicationListQuery = clubQueries.applicationList(id);
  const { data: applicationList } = useSuspenseQuery({
    ...applicationListQuery,
    queryKey: canViewApplications
      ? applicationListQuery.queryKey
      : ["club", "applications", "permission-denied", id],
    queryFn: canViewApplications
      ? applicationListQuery.queryFn
      : () => Promise.resolve({ applications: [] }),
  });

  if (!canViewApplications) {
    return (
      <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
        <div className="bg-background-surface flex h-[520px] min-h-0 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6">
          <Club isActive={false} size={32} />
          <p className="text-text-1 text-main-text text-center">
            신청자 목록을 조회할 권한이 없어요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 overflow-y-auto sm:px-8 lg:px-8 xl:px-10 xl:pb-6 2xl:px-18">
      <div className="bg-background-surface flex h-fit min-h-0 w-full flex-col gap-6 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClubBackButton />
            <span className="text-text-1 text-main-text">
              동아리 신청자 목록
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-title-2 text-main-text">{detail.club.name}</h1>
          <p className="text-text-3 text-sub-1">
            총 {applicationList.applications.length}명의 신청자가 있어요.
          </p>
        </div>

        {applicationList.applications.length === 0 ? (
          <ClubApplicationListSection.Empty />
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
                    {canApproveApplications && (
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
                    )}
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

ClubApplicationListSection.Loading = ClubApplicationListSectionLoading;
ClubApplicationListSection.Error = ClubApplicationListSectionError;
ClubApplicationListSection.Empty = ClubApplicationListSectionEmpty;

function ClubApplicationListSectionBoundary({
  id,
}: ClubApplicationListSectionProps) {
  return (
    <ClientQueryBoundary
      loadingFallback={<ClubApplicationListSection.Loading />}
      errorFallback={ClubApplicationListSection.Error}
    >
      <ClubApplicationListSection id={id} />
    </ClientQueryBoundary>
  );
}

export { ClubApplicationListSection, ClubApplicationListSectionBoundary };
