"use client";

import { useState } from "react";
import Club from "@/shared/asset/svg/Club";
import ClubCard from "@/entities/club/ui/ClubCard";
import ClubDetail from "@/entities/club/ui/ClubDetail";
import {
  Club as ClubType,
  ClubDetail as ClubDetailType,
} from "@/entities/club/model/club";
import { MOCK_CLUBS, MOCK_CLUB_DETAILS } from "@/entities/club/model/mock";
import ClubSearch from "./ClubSearch";

export function ClubSection() {
  const [query, setQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<ClubDetailType | null>(
    null,
  );

  const isSearching = searchValue !== "";
  const filteredClubs = isSearching
    ? MOCK_CLUBS.filter(
        (club) =>
          club.name.includes(searchValue) || club.leader.includes(searchValue),
      )
    : MOCK_CLUBS;

  const handleSearch = () => setSearchValue(query);
  const handleSelectClub = (club: ClubType) => {
    const detail = MOCK_CLUB_DETAILS[club.id] ?? {
      club,
      member: [],
      project: [],
    };
    setSelectedDetail(detail);
  };

  return (
    <div className="flex flex-1 w-full px-18 pb-6">
      <div className="flex h-auto w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Club isActive={false} size={20} />
            <span className="text-text-1 text-main-text">동아리</span>
            {!selectedDetail && (
              <div>
                <span className="text-caption-1 text-sub-1">동아리 수</span>
                <span className="text-caption-1 text-p-1">
                  {" "}
                  {filteredClubs.length}개
                </span>
              </div>
            )}
          </div>
        </div>

        {selectedDetail ? (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <ClubDetail detail={selectedDetail} />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-row items-stretch gap-4">
            <div className="h-full min-h-0 flex-1 overflow-y-scroll pr-2">
              <div className="grid grid-cols-4 gap-4">
                {filteredClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    onClick={() => handleSelectClub(club)}
                  />
                ))}
              </div>
            </div>
            <div className="shrink-0 self-start">
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
