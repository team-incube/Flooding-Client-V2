import { instance } from "@/shared/api/instance";
import type { HomebaseReservation } from "@/entities/homebase/model/homebase";

type HomebaseResponse =
  | HomebaseReservation[]
  | { data?: HomebaseReservation[] };

export async function getHomebaseReservations(): Promise<HomebaseReservation[]> {
  const { data } = await instance.get<HomebaseResponse>("/homebase");
  return Array.isArray(data) ? data : (data.data ?? []);
}
