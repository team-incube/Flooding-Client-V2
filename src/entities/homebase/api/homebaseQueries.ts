import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { getHomebaseReservations } from "@/entities/homebase/api/getHomebase";
import type { HomebaseApplyRequest } from "@/entities/homebase/model/homebase";

export const homebaseQueries = {
  list: (date: string) =>
    queryOptions({
      queryKey: ["homebase", "list", date],
      queryFn: () => getHomebaseReservations(date),
    }),
} as const;

export const homebaseMutations = {
  apply: (homebaseId: number, body: HomebaseApplyRequest) =>
    instance.post(`/homebase/${homebaseId}`, body),

  cancel: (reservationId: number) =>
    instance.delete(`/homebase/${reservationId}`),
};
