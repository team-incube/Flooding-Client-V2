import {
  getHomebaseLocation,
  toSchoolReservation,
} from "@/entities/homebase/lib/homebaseReservation";
import type {
  HomebaseApplyRequest,
  HomebaseReservation,
} from "@/entities/homebase/model/homebase";
import type { Reservation } from "@/entities/school/model/reservation";
import type { User } from "@/entities/user/model/user";

type PeriodButtonVariant = "filled" | "outlined" | "disabled";

interface SelectPeriodRangeParams {
  period: string;
  selectedStartPeriod: string;
  selectedEndPeriod: string;
  periods: string[];
}

interface HomebaseReservationConflictParams {
  reservations: HomebaseReservation[];
  homebaseId: number | null;
  startPeriod: number;
  endPeriod: number;
  currentStudentNumber?: number;
}

interface ReservedTableMembersParams {
  reservations: HomebaseReservation[];
  selectedFloor: string;
  startPeriod: number;
  endPeriod: number;
}

interface HomebaseApplyRequestParams {
  startPeriod: number;
  endPeriod: number;
  reason: string;
  currentUser?: User | null;
  selectedStudents: User[];
}

const floorOrder: Record<string, number> = { "2F": 0, "3F": 1, "4F": 2 };

export function getPeriodNumber(period: string, periods: string[]): number {
  return 8 + periods.indexOf(period);
}

export function selectPeriodRange({
  period,
  selectedStartPeriod,
  selectedEndPeriod,
  periods,
}: SelectPeriodRangeParams): {
  startPeriod: string;
  endPeriod: string;
  shouldResetTable: boolean;
} {
  const clickedIdx = periods.indexOf(period);
  const startIdx = periods.indexOf(selectedStartPeriod);
  const endIdx = periods.indexOf(selectedEndPeriod);
  const isSameBlock = Math.floor(clickedIdx / 2) === Math.floor(startIdx / 2);

  if (!isSameBlock) {
    return {
      startPeriod: period,
      endPeriod: period,
      shouldResetTable: true,
    };
  }

  if (clickedIdx === startIdx && startIdx !== endIdx) {
    return {
      startPeriod: periods[startIdx + 1],
      endPeriod: selectedEndPeriod,
      shouldResetTable: false,
    };
  }

  if (clickedIdx === endIdx && startIdx !== endIdx) {
    return {
      startPeriod: selectedStartPeriod,
      endPeriod: periods[endIdx - 1],
      shouldResetTable: false,
    };
  }

  const newMin = Math.min(startIdx, endIdx, clickedIdx);
  const newMax = Math.max(startIdx, endIdx, clickedIdx);

  return {
    startPeriod: periods[newMin],
    endPeriod: periods[newMax],
    shouldResetTable: false,
  };
}

export function getPeriodVariant({
  period,
  selectedStartPeriod,
  selectedEndPeriod,
  periods,
  isStarted,
}: SelectPeriodRangeParams & {
  isStarted: boolean;
}): PeriodButtonVariant {
  if (isStarted) return "disabled";

  const idx = periods.indexOf(period);
  const startIdx = periods.indexOf(selectedStartPeriod);
  const endIdx = periods.indexOf(selectedEndPeriod);

  return idx >= Math.min(startIdx, endIdx) &&
    idx <= Math.max(startIdx, endIdx)
    ? "filled"
    : "outlined";
}

export function hasHomebaseReservationConflict({
  reservations,
  homebaseId,
  startPeriod,
  endPeriod,
  currentStudentNumber,
}: HomebaseReservationConflictParams): boolean {
  return reservations.some((reservation) => {
    const isTimeOverlap =
      reservation.startPeriod <= endPeriod &&
      reservation.endPeriod >= startPeriod;

    if (!isTimeOverlap) return false;

    const isSameTable = reservation.homebaseId === homebaseId;
    const isMyReservation = reservation.members.some(
      (member) => member.studentNumber === String(currentStudentNumber),
    );

    return isSameTable || isMyReservation;
  });
}

export function getReservedTableMembers({
  reservations,
  selectedFloor,
  startPeriod,
  endPeriod,
}: ReservedTableMembersParams): Record<string, string[]> {
  return reservations
    .filter((reservation) => {
      const location = getHomebaseLocation(reservation.homebaseId);
      return (
        location.floor === selectedFloor &&
        reservation.startPeriod <= endPeriod &&
        reservation.endPeriod >= startPeriod
      );
    })
    .reduce<Record<string, string[]>>((acc, reservation) => {
      const { tableId } = getHomebaseLocation(reservation.homebaseId);
      acc[tableId] = reservation.members.map(
        (member) => `${member.studentNumber} ${member.name}`,
      );
      return acc;
    }, {});
}

export function getSortedReservations(
  reservations: HomebaseReservation[],
): Reservation[] {
  return reservations
    .slice()
    .sort((a, b) => {
      const floorA = floorOrder[getHomebaseLocation(a.homebaseId).floor] ?? 0;
      const floorB = floorOrder[getHomebaseLocation(b.homebaseId).floor] ?? 0;
      return floorA - floorB || a.startPeriod - b.startPeriod;
    })
    .map(toSchoolReservation);
}

export function getMyHomebaseReservations(
  reservations: HomebaseReservation[],
  currentStudentNumber?: number,
): HomebaseReservation[] {
  if (!currentStudentNumber) return [];

  return reservations.filter((reservation) =>
    reservation.members.some(
      (member) => member.studentNumber === String(currentStudentNumber),
    ),
  );
}

export function createHomebaseApplyRequest({
  startPeriod,
  endPeriod,
  reason,
  currentUser,
  selectedStudents,
}: HomebaseApplyRequestParams): HomebaseApplyRequest {
  const meMembers = currentUser
    ? [
        {
          studentNumber: String(currentUser.studentNumber),
          name: currentUser.name,
        },
      ]
    : [];

  return {
    startPeriod,
    endPeriod,
    reason,
    members: [
      ...meMembers,
      ...selectedStudents.map((student) => ({
        studentNumber: String(student.studentNumber),
        name: student.name,
      })),
    ],
  };
}
