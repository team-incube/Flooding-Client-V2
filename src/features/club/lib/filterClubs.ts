import type { Club, ClubType } from "@/entities/club/model/club";

export type ClubTypeFilter = ClubType | "ALL";

interface FilterClubsParams {
  clubs: Club[];
  searchValue: string;
  type: ClubTypeFilter;
}

export function filterClubs({
  clubs,
  searchValue,
  type,
}: FilterClubsParams): Club[] {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  return clubs.filter((club) => {
    const matchesType = type === "ALL" || club.type === type;
    const matchesSearch =
      !normalizedSearchValue ||
      club.name.toLowerCase().includes(normalizedSearchValue) ||
      club.leader.toLowerCase().includes(normalizedSearchValue);

    return matchesType && matchesSearch;
  });
}
