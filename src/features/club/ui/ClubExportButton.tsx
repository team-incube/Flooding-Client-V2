"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userQueries } from "@/entities/user/api/userQueries";
import { exportClubs } from "@/entities/club/api/exportClubs";

export default function ClubExportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useQuery(userQueries.me());

  if (user?.role !== "ADMIN") return null;

  const handleExport = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await exportClubs();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-caption-1 text-sub-1">동아리 엑셀로 뽑기</span>
      <button
        onClick={handleExport}
        disabled={isLoading}
        className="text-caption-1 text-p-1 cursor-pointer text-left disabled:opacity-50 disabled:cursor-default"
      >
        {isLoading ? "다운로드 중..." : "다운로드 >"}
      </button>
    </div>
  );
}
