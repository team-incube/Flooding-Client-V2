import type { Reservation } from "@/entities/school/model/reservation";
import type { HomebaseReservation } from "../model/homebase";

interface HomebaseLocation {
  floor: string;
  tableId: string;
  tableName: string;
}

const HOMEBASE_LOCATION_MAP: Record<number, HomebaseLocation> = {
  1: { floor: "2F", tableId: "1", tableName: "테이블 1" },
  2: { floor: "2F", tableId: "2", tableName: "테이블 2" },
  3: { floor: "2F", tableId: "3", tableName: "테이블 3" },
  4: { floor: "3F", tableId: "1", tableName: "테이블 1" },
  5: { floor: "3F", tableId: "2", tableName: "테이블 2" },
  6: { floor: "3F", tableId: "3", tableName: "테이블 3" },
  7: { floor: "3F", tableId: "5", tableName: "테이블 5" },
  8: { floor: "3F", tableId: "6", tableName: "테이블 6" },
  9: { floor: "4F", tableId: "1", tableName: "테이블 1" },
  10: { floor: "4F", tableId: "2", tableName: "테이블 2" },
  11: { floor: "4F", tableId: "3", tableName: "테이블 3" },
  12: { floor: "4F", tableId: "4", tableName: "테이블 4" },
};

const HOMEBASE_ID_BY_TABLE: Record<string, number> = Object.fromEntries(
  Object.entries(HOMEBASE_LOCATION_MAP).map(([homebaseId, location]) => [
    `${location.floor}-${location.tableId}`,
    Number(homebaseId),
  ]),
);

export function getHomebaseId(floor: string, tableId: string): number | null {
  return HOMEBASE_ID_BY_TABLE[`${floor}-${tableId}`] ?? null;
}

export function getHomebaseLocation(homebaseId: number): HomebaseLocation {
  return (
    HOMEBASE_LOCATION_MAP[homebaseId] ?? {
      floor: "?F",
      tableId: String(homebaseId),
      tableName: `테이블 ${homebaseId}`,
    }
  );
}

export function toReservationPeriods(
  startPeriod: number,
  endPeriod: number,
): string[] {
  const periods: string[] = [];

  for (let period = startPeriod; period <= endPeriod; period += 1) {
    periods.push(`${period}교시`);
  }

  return periods;
}

export function toSchoolReservation(
  reservation: HomebaseReservation,
): Reservation {
  const { floor, tableName } = getHomebaseLocation(reservation.homebaseId);

  return {
    id: reservation.id,
    tableName,
    floor,
    members: reservation.members.map(
      (member) => `${member.studentNumber} ${member.name}`,
    ),
    periods: toReservationPeriods(
      reservation.startPeriod,
      reservation.endPeriod,
    ),
    reason: reservation.reason,
  };
}
