import type { Club, ClubOpeningStatus } from "@/entities/club/model/club";

interface FilterClubsParams {
  clubs: Club[];
  openingStatus: ClubOpeningStatus;
  searchValue: string;
}

export function filterClubs({
  clubs,
  openingStatus,
  searchValue,
}: FilterClubsParams): Club[] {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  if (!normalizedSearchValue || openingStatus.isOpened) {
    return clubs;
  }

  return clubs.filter((club) => {
    return (
      club.name.toLowerCase().includes(normalizedSearchValue) ||
      club.leader?.toLowerCase().includes(normalizedSearchValue)
    );
  });
}
