"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { userQueries } from "@/entities/user/api/userQueries";
import { exportClubs } from "@/entities/club/api/exportClubs";
import { createClubPermission } from "@/entities/user/lib/permission";
import Back from "@/shared/asset/svg/Back";

export default function ClubExportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useSuspenseQuery(userQueries.me());
  const clubPermission = createClubPermission({ role: user.role });

  if (!clubPermission.canExport) return null;

  const handleExport = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const toastId = toast.loading("동아리 명단 엑셀 다운로드를 준비 중입니다.");
    try {
      await exportClubs();
      toast.success("동아리 명단 엑셀 다운로드를 시작했습니다.", {
        id: toastId,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "동아리 명단 엑셀 다운로드에 실패했습니다.";
      toast.error(message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-text-1 text-sub-2 font-semibold">
        전공 동아리 전체 명단 엑셀로 출력하기
      </span>
      <button
        onClick={handleExport}
        disabled={isLoading}
        className="text-text-1 text-sub-2 flex cursor-pointer items-center gap-1 disabled:cursor-default disabled:opacity-50"
      >
        다운로드 <Back direction="right" />
      </button>
    </div>
  );
}
