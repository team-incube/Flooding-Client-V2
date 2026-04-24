import { instance } from "@/shared/api/instance";
import type { HomebaseReservation } from "@/entities/homebase/model/homebase";

export async function getHomebaseReservations(): Promise<HomebaseReservation[]> {
  const { data } = await instance.get<HomebaseReservation[]>("/homebase");
  return data;
}
