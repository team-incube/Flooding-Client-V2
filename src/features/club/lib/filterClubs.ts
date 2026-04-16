import type { Club } from "@/entities/club/model/club";

interface FilterClubsParams {
  clubs: Club[];
  isRegistrationPeriod: boolean;
  searchValue: string;
}

export function filterClubs({
  clubs,
  isRegistrationPeriod,
  searchValue,
}: FilterClubsParams): Club[] {
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  if (!normalizedSearchValue || isRegistrationPeriod) {
    return clubs;
  }

  return clubs.filter((club) => {
    return (
      club.name.toLowerCase().includes(normalizedSearchValue) ||
      club.leader.toLowerCase().includes(normalizedSearchValue)
    );
  });
}
