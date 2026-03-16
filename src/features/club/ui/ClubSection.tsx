"use client";

import { useState } from "react";
import Club from "@/shared/asset/svg/Club";
import ClubCard from "@/entities/club/ui/ClubCard";
import { MOCK_CLUBS } from "@/entities/club/model/mock";
import ClubSearch from "./ClubSearch";

export function ClubSection() {
  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const isSearching = searchValue !== "";
  const filteredClubs = isSearching
    ? MOCK_CLUBS.filter(
        (club) =>
          club.name.includes(searchValue) ||
          club.presidentName.includes(searchValue),
      )
    : MOCK_CLUBS;

  const handleSearch = () => setSearchValue(query);

  return (
    <div className="flex flex-1 overflow-y-auto px-18">
      <div className="flex flex-col gap-4 bg-background-surface rounded-2xl p-6 w-full h-fit">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Club isActive={false} size={20} />
            <span className="text-text-1 text-main-text">동아리</span>
            <span className="text-caption-1 text-sub-2">
              동아리 수 {filteredClubs.length}개
            </span>
          </div>
        </div>
        <div className="flex flex-row items-start gap-4">
          <div className="grid grid-cols-4 gap-4">
            {filteredClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
          <div className="shrink-0">
            <ClubSearch
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
