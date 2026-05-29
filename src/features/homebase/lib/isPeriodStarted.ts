import { minutesOfDay, nowKst } from "@/shared/lib/kst";
import { HOMEBASE_SCHEDULE, PERIODS } from "../model/constants";

function isPastTime(timeStr: string): boolean {
  const [hour, minute] = timeStr.split(":").map(Number);
  return minutesOfDay(nowKst()) >= hour * 60 + minute;
}

export function isPeriodStarted(period: string): boolean {
  if (!isPastTime(HOMEBASE_SCHEDULE.periods["5교시"].start)) return true;
  const schedule = HOMEBASE_SCHEDULE.periods[period];
  if (!schedule) return false;
  return isPastTime(schedule.start);
}

export function isAllPeriodsStarted(): boolean {
  return PERIODS.every(isPeriodStarted);
}
