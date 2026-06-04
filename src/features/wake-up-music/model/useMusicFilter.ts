import { useState, useMemo } from "react";
import type { DormitoryMusicQueryParams } from "@/entities/dormitory/model/dormitory";

export type FilterType = "time" | "grade" | "name" | "none";

export interface MusicFilterState {
  grade?: number;
  timeOrder?: "asc" | "desc";
  nameOrder?: "asc";
}

export function useMusicFilter() {
  const [filterState, setFilterState] = useState<MusicFilterState>({});

  const filterParams = useMemo<DormitoryMusicQueryParams>(() => {
    const params: DormitoryMusicQueryParams = {};

    if (filterState.grade != null) {
      params.grade = filterState.grade;
    }

    if (filterState.timeOrder && filterState.nameOrder) {
      params.sort = "time";
      params.order = filterState.timeOrder;
      params.secondarySort = "name";
      params.secondaryOrder = "asc";
    } else if (filterState.timeOrder) {
      params.sort = "time";
      params.order = filterState.timeOrder;
    } else if (filterState.nameOrder) {
      params.sort = "name";
      params.order = "asc";
    }

    return params;
  }, [filterState]);

  const filterButtonLabel = useMemo(() => {
    const labels: string[] = [];

    if (filterState.timeOrder) {
      labels.push(
        filterState.timeOrder === "asc" ? "시간순 (오래된)" : "시간순 (최근)",
      );
    }
    if (filterState.nameOrder) {
      labels.push("이름순");
    }
    if (filterState.grade != null) {
      labels.push(`${filterState.grade}학년`);
    }

    return labels.length > 0 ? labels.join(" • ") : "필터링";
  }, [filterState]);

  const hasFilter = Boolean(
    filterState.timeOrder || filterState.nameOrder || filterState.grade != null,
  );

  const setFilter = (filterType: FilterType, filterValue: string | number) => {
    setFilterState((prevState) => {
      if (filterType === "grade") {
        const newGrade = Number(filterValue);
        if (prevState.grade === newGrade) {
          const { grade, ...rest } = prevState;
          return rest;
        }
        return { ...prevState, grade: newGrade };
      }

      if (filterType === "time") {
        const newOrder =
          filterValue === "asc" ? ("asc" as const) : ("desc" as const);
        if (prevState.timeOrder === newOrder) {
          const { timeOrder, ...rest } = prevState;
          return rest;
        }
        return { ...prevState, timeOrder: newOrder };
      }

      if (filterType === "name") {
        if (prevState.nameOrder) {
          const { nameOrder, ...rest } = prevState;
          return rest;
        }
        return { ...prevState, nameOrder: "asc" as const };
      }

      return prevState;
    });
  };

  const clearFilter = () => {
    setFilterState({});
  };

  return {
    filterState,
    filterParams,
    filterButtonLabel,
    hasFilter,
    setFilter,
    clearFilter,
  };
}
