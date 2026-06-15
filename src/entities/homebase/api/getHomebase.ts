import { instance } from "@/shared/api/instance";
import type { HomebaseReservation } from "@/entities/homebase/model/homebase";

type HomebaseResponse =
  | HomebaseReservation[]
  | { data?: HomebaseReservation[] };

export async function getHomebaseReservations(
  date: string,
): Promise<HomebaseReservation[]> {
  const { data } = await instance.get<HomebaseResponse>("/homebase", {
    params: { date },
  });
  return Array.isArray(data) ? data : (data.data ?? []);
}
