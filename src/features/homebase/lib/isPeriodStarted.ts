import { HOMEBASE_SCHEDULE, PERIODS } from "../model/constants";

function isPastTime(timeStr: string): boolean {
  const [hour, minute] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  return now >= target;
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
