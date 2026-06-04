import { useState } from "react";
import type { DormitoryMusicQueryParams } from "@/entities/dormitory/model/dormitory";

export type WakeUpMusicSort = "TIME" | "LIKE";

const SORT_LABELS: Record<WakeUpMusicSort, string> = {
  TIME: "시간순",
  LIKE: "좋아요순",
};

export function useMusicFilter() {
  const [sort, setSort] = useState<WakeUpMusicSort>("TIME");

  const filterParams: DormitoryMusicQueryParams = { sort };
  const filterButtonLabel = SORT_LABELS[sort];
  const hasFilter = sort !== "TIME";

  return {
    sort,
    setSort,
    filterParams,
    filterButtonLabel,
    hasFilter,
  };
}
