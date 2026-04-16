import { PERIODS_TIME } from "../model/constants";

export function isPeriodStarted(period: string): boolean {
  const now = new Date();
  const [hour, minute] = PERIODS_TIME[period].split(":").map(Number);
  const periodTime = new Date();
  periodTime.setHours(hour, minute, 0, 0);
  return now >= periodTime;
}
