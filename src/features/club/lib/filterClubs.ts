import type { Club } from "@/entities/club/model/club";

interface FilterClubsParams {
  clubs: Club[];
  searchValue: string;
}

export function filterClubs({
  clubs,
  searchValue,
}: FilterClubsParams): Club[] {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  if (!normalizedSearchValue) {
    return clubs;
  }

  return clubs.filter((club) => {
    return (
      club.name.toLowerCase().includes(normalizedSearchValue) ||
      club.leader?.toLowerCase().includes(normalizedSearchValue)
    );
  });
}
