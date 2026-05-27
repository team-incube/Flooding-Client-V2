import { PERIODS, PERIODS_TIME } from "../model/constants";

export function isPeriodStarted(period: string): boolean {
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
