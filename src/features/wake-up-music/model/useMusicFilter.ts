import { useState, useMemo } from "react";
import type { DormitoryMusicQueryParams } from "@/entities/dormitory/model/dormitory";

export type FilterType = "time" | "grade" | "name" | "none";

interface MusicFilterState {
  filterType: FilterType;
  filterValue: string | number;
}

export function useMusicFilter() {
  const [filterState, setFilterState] = useState<MusicFilterState>({
    filterType: "none",
    filterValue: "",
  });

  const filterParams = useMemo<DormitoryMusicQueryParams>(() => {
    if (filterState.filterType === "none") {
      return {};
    }

    if (filterState.filterType === "grade") {
      return {
        grade: Number(filterState.filterValue),
      };
    }

    if (filterState.filterType === "time") {
      return {
        sort: "time",
        order: filterState.filterValue === "asc" ? "asc" : "desc",
      };
    }

    if (filterState.filterType === "name") {
      return {
        sort: "name",
        order: filterState.filterValue === "asc" ? "asc" : "desc",
      };
    }

    return {};
  }, [filterState]);

  const setFilter = (filterType: FilterType, filterValue: string | number) => {
    setFilterState({ filterType, filterValue });
  };

  const clearFilter = () => {
    setFilterState({ filterType: "none", filterValue: "" });
  };

  return {
    filterState,
    filterParams,
    setFilter,
    clearFilter,
  };
}
