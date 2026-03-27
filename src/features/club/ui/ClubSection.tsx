"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Club from "@/shared/asset/svg/Club";
import ClubCard from "@/entities/club/ui/ClubCard";
import { MOCK_CLUBS } from "@/entities/club/model/mock";
import ClubSearch from "./ClubSearch";
import ClubRegistrationSection from "./ClubRegistrationSection";

export function ClubSection() {
  const router = useRouter();
  const isRegistrationPeriod = true; // API 연동 시 서버 응답 값으로 교체 예정

  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const isSearching = searchValue !== "";
  const filteredClubs = (isSearching && !isRegistrationPeriod)
    ? MOCK_CLUBS.filter(
        (club) =>
          club.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          club.leader.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : MOCK_CLUBS;

  const handleSearch = () => setSearchValue(query);
  const handleSelectClub = (clubId: number) => router.push(`/club/${clubId}`);

  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Club isActive={false} size={20} />
            <span className="text-text-1 text-main-text">동아리</span>
            <div>
              <span className="text-caption-1 text-sub-1">동아리 수</span>
              <span className="text-caption-1 text-p-1">
                {" "}
                {isRegistrationPeriod ? 0 : MOCK_CLUBS.length}개
              </span>
            </div>
          </div>
        </div>

        {isRegistrationPeriod ? (
          <ClubRegistrationSection />
        ) : (
          <div className="flex h-full min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch">
            <div className="order-2 min-h-0 flex-1 overflow-y-auto lg:order-1 lg:h-full lg:overflow-y-scroll lg:pr-2">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(263px,1fr))] gap-4">
                {filteredClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    onClick={() => handleSelectClub(club.id)}
                  />
                ))}
              </div>
            </div>
            <div className="order-1 self-stretch lg:order-2 lg:shrink-0 lg:self-start">
              <ClubSearch
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
