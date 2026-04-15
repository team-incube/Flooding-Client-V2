import { PERIODS_TIME, TABLE_MAX_PERSONNEL } from "../model/constants";

export function isPeriodStarted(period: string): boolean {
  const now = new Date();
  const [hour, minute] = PERIODS_TIME[period].split(":").map(Number);
  const periodTime = new Date();
  periodTime.setHours(hour, minute, 0, 0);
  return now >= periodTime;
}

export function getMaxPersonnel(
  floor: string,
  table: string | null,
): number {
  if (!table) return 0;
  const floorKey = floor as keyof typeof TABLE_MAX_PERSONNEL;
  if (!TABLE_MAX_PERSONNEL[floorKey]) return 0;
  const floorTables = TABLE_MAX_PERSONNEL[floorKey];
  const tableKey = table as keyof typeof floorTables;
  return floorTables[tableKey] ?? 0;
}
