import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { getHomebaseReservations } from "@/entities/homebase/api/getHomebase";
import type {
  HomebaseApplyRequest,
  HomebasePatchRequest,
} from "@/entities/homebase/model/homebase";

export const homebaseQueries = {
  list: () =>
    queryOptions({
      queryKey: ["homebase", "list"],
      queryFn: getHomebaseReservations,
    }),
} as const;

export const homebaseMutations = {
  apply: (homebaseId: number, body: HomebaseApplyRequest) =>
    instance.post(`/homebase/${homebaseId}`, body),

  cancel: (reservationId: number) =>
    instance.delete(`/homebase/${reservationId}`),

  update: (reservationId: number, body: HomebasePatchRequest) =>
    instance.patch(`/homebase/${reservationId}`, body),
};
