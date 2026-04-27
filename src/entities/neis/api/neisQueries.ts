import { queryOptions } from "@tanstack/react-query";
import { getTimetables, getMeals } from "@/entities/neis/api/getNeis";
import type { TimetableParams } from "@/entities/neis/model/neis";

export const neisQueries = {
  timetables: (params: TimetableParams) =>
    queryOptions({
      queryKey: ["neis", "timetables", params],
      queryFn: () => getTimetables(params),
    }),

  meals: (date: string) =>
    queryOptions({
      queryKey: ["neis", "meals", date],
      queryFn: () => getMeals(date),
    }),
} as const;
