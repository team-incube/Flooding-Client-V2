import { isTimeInWindow } from "@/shared/lib/timeWindow";

export function isStudyApplicationTime(date: Date): boolean {
  return isTimeInWindow({
    date,
    start: { hour: 20, minute: 0 },
    end: { hour: 21, minute: 0 },
  });
}

export function isMassageApplicationTime(date: Date): boolean {
  return isTimeInWindow({
    date,
    start: { hour: 20, minute: 20 },
    end: { hour: 21, minute: 0 },
  });
}
