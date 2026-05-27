import {
  PERIODS,
  PERIODS_TIME,
  RESERVATION_OPEN_TIME,
} from "../model/constants";

function isBeforeReservationOpen(): boolean {
  const [hour, minute] = RESERVATION_OPEN_TIME.split(":").map(Number);
  const now = new Date();
  const openTime = new Date();
  openTime.setHours(hour, minute, 0, 0);
  return now < openTime;
}

export function isPeriodStarted(period: string): boolean {
  if (isBeforeReservationOpen()) return true;
  const timeStr = PERIODS_TIME[period];
  if (!timeStr) return false;
  const now = new Date();
  const [hour, minute] = timeStr.split(":").map(Number);
  const periodTime = new Date();
  periodTime.setHours(hour, minute, 0, 0);
  return now >= periodTime;
}

export function isAllPeriodsStarted(): boolean {
  return PERIODS.every(isPeriodStarted);
}
