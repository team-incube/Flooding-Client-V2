"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Club from "@/shared/asset/svg/Club";
import ClubCard from "@/entities/club/ui/ClubCard";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { filterClubs } from "../lib/filterClubs";
import ClubSearch from "./ClubSearch";
import ClubRegistrationSection from "./ClubRegistrationSection";
import { ClubOpeningRequestSection } from "./ClubOpeningRequestSection";
import Back from "@/shared/asset/svg/Back";
import Smile from "@/shared/asset/svg/Smile";
import { isRegistrationPeriod } from "../config";

export function ClubSection() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<"form" | "list">("form");
  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data } = useQuery(clubQueries.list());
  const { data: user } = useQuery(userQueries.me());
  const isManager = user?.role === "ADMIN" || user?.role === "STUDENT_COUNCIL";
  const hasClubApplication = user?.hasClubApplication ?? false;
  const clubs = data?.clubs ?? [];

  const filteredClubs = filterClubs({
    clubs,
    isRegistrationPeriod,
    searchValue,
  });

  const handleGoBackToList = () => {
    setViewMode("list");
    queryClient.invalidateQueries(clubQueries.list());
  };

  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Club isActive={false} size={20} />
            <span className="text-text-1 text-main-text">동아리</span>
            <div>
              <span className="text-caption-1 text-sub-1">동아리 수 </span>
              <span className="text-caption-1 text-p-1">
                {filteredClubs.length}개
              </span>
            </div>
          </div>
        </div>

        {isManager && <ClubOpeningRequestSection />}

        {isRegistrationPeriod && !hasClubApplication && viewMode !== "list" ? (
          <ClubRegistrationSection onGoBackToList={handleGoBackToList} />
        ) : (
          <div className="flex h-full min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="order-2 min-h-0 flex-1 overflow-y-auto lg:order-1 lg:h-full lg:overflow-y-scroll lg:pr-2">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(263px,1fr))] gap-4">
                {filteredClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    onClick={() => router.push(`/club/${club.id}`)}
                  />
                ))}
              </div>
            </div>
            <div className="order-1 flex flex-col items-center justify-center lg:order-2 lg:w-[330px] lg:shrink-0 lg:self-stretch">
              {!isRegistrationPeriod && (
                <div className="w-full mb-auto">
                  <ClubSearch
                    query={query}
                    setQuery={setQuery}
                    onSearch={() => setSearchValue(query)}
                  />
                </div>
              )}

              {isRegistrationPeriod && hasClubApplication && (
                <div className="flex flex-col gap-4 items-center justify-center">
                  <Smile />
                  <p className="text-sub-2 text-text-1">
                    동아리 신청은 1인 1회 신청입니다
                  </p>
                  <button
                    onClick={() => setViewMode("form")}
                    className="flex items-center gap-1 text-sub-2 text-text-1 cursor-pointer"
                  >
                    내 동아리 수정하기 <Back direction="right"/>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
