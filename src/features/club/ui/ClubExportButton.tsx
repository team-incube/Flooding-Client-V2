"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { userQueries } from "@/entities/user/api/userQueries";
import { exportClubs } from "@/entities/club/api/exportClubs";
import Back from "@/shared/asset/svg/Back";

export default function ClubExportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useQuery(userQueries.me());

  if (user?.role !== "ADMIN") return null;

  const handleExport = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await exportClubs();
      toast.success("동아리 명단 엑셀 다운로드를 시작했습니다.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "동아리 명단 엑셀 다운로드에 실패했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-text-1 text-sub-2 font-semibold">
        개설 신청 동아리 엑셀로 뽑기
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
