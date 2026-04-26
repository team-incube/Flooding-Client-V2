"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import Club from "@/shared/asset/svg/Club";
import ClubDetail from "@/entities/club/ui/ClubDetail";
import { clubQueries } from "@/entities/club/api/clubQueries";

interface ClubDetailSectionProps {
  id: number;
}

export function ClubDetailSection({ id }: ClubDetailSectionProps) {
  const { data: detail, isLoading, isError } = useQuery(clubQueries.detail(id));

  if (isLoading || !detail) {
    return null;
  }

  if (isError) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center gap-2">
          <Club isActive={false} size={20} />
          <span className="text-text-1 text-main-text">동아리</span>
        </div>
        <div className="w-full">
          <ClubDetail detail={detail} />
        </div>
      </div>
    </div>
  );
}
