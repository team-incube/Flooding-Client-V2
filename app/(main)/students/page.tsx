"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { StudentManagementSection } from "@/features/self-study/ui/StudentManagementSection";
import { userQueries } from "@/entities/user/api/userQueries";
import { isManagementRole } from "@/entities/user/lib/userRole";
import { TextButton } from "@/shared/ui/Button/TextButton";

export default function StudentsPage() {
  const router = useRouter();
  const { data: user, isLoading, isError } = useQuery(userQueries.me());

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col overflow-y-auto px-8 pb-25 lg:px-10 2xl:px-18">
        <section className="rounded-2xl bg-background-surface p-6">
          <span className="text-text-3 text-sub-1">
            권한을 확인하는 중입니다.
          </span>
        </section>
      </main>
    );
  }

  if (isError || !isManagementRole(user?.role)) {
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
      <StudentManagementSection />
    </main>
  );
}
