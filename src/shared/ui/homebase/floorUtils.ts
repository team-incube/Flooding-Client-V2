import type { Reservation } from "@/entities/school/model/reservation";

export function getRes(reservations: Reservation[], name: string) {
  return reservations.find((r) => r.tableName === name);
}
