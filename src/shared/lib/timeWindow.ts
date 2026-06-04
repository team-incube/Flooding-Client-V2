import type { Temporal } from "temporal-polyfill";
import { minutesOfDay } from "@/shared/lib/kst";

export interface TimeOfDay {
  hour: number;
  minute: number;
}

function toMinutes({ hour, minute }: TimeOfDay): number {
  return hour * 60 + minute;
}

export function isTimeInWindow({
  date,
  start,
  end,
}: {
  date: Temporal.PlainDateTime;
  start: TimeOfDay;
  end: TimeOfDay;
}): boolean {
  const currentMinutes = minutesOfDay(date);

  return currentMinutes >= toMinutes(start) && currentMinutes < toMinutes(end);
}
