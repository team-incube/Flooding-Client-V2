"use client";

import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { StudentManagementSection } from "@/features/self-study/ui/StudentManagementSection";
import { userQueries } from "@/entities/user/api/userQueries";
import { isManagementRole } from "@/entities/user/lib/userRole";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";

function StudentsPageError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col overflow-y-auto px-8 pb-25 lg:px-10 2xl:px-18">
      <section className="flex flex-col gap-4 rounded-2xl bg-background-surface p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-title-3 text-main-text">
            학생관리 정보를 불러오지 못했어요
          </h2>
          <p className="text-text-3 text-sub-1">잠시 후 다시 시도해주세요.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <TextButton variant="filled" size="fit" onClick={resetErrorBoundary}>
            다시 시도
          </TextButton>
          <TextButton
            variant="outlined"
            size="fit"
            onClick={() => router.push("/")}
          >
            홈으로
          </TextButton>
        </div>
      </section>
    </main>
  );
}

function StudentsPageContent() {
  const router = useRouter();
  const { data: user } = useSuspenseQuery(userQueries.me());

  if (!isManagementRole(user.role)) {
    return (
      <main className="flex flex-1 flex-col overflow-y-auto px-8 pb-25 lg:px-10 2xl:px-18">
        <section className="flex flex-col gap-4 rounded-2xl bg-background-surface p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-title-3 text-main-text">접근 권한이 없어요</h2>
            <p className="text-text-3 text-sub-1">
              학생관리는 관리자, 기자위, 학생회 계정에서만 사용할 수 있어요.
            </p>
          </div>
          <TextButton
            variant="filled"
            size="medium"
            onClick={() => router.push("/")}
          >
            홈으로
          </TextButton>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col overflow-y-auto px-8 lg:px-10 2xl:px-18 pb-25">
      <ClientQueryBoundary
        loadingFallback={<StudentManagementSection.Loading />}
        errorFallback={StudentManagementSection.Error}
      >
        <StudentManagementSection />
      </ClientQueryBoundary>
    </main>
  );
}

export default function StudentsPage() {
  return (
    <ClientQueryBoundary
      loadingFallback={
        <main className="flex flex-1 flex-col overflow-y-auto px-8 pb-25 lg:px-10 2xl:px-18">
          <StudentManagementSection.Loading />
        </main>
      }
      errorFallback={StudentsPageError}
    >
      <StudentsPageContent />
    </ClientQueryBoundary>
  );
}
