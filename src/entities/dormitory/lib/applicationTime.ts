import { isTimeInWindow } from "@/shared/lib/timeWindow";

const APPLICATION_END_TIME = { hour: 21, minute: 0 };

export function isStudyApplicationTime(date: Date): boolean {
  return isTimeInWindow({
    date,
    start: { hour: 20, minute: 0 },
    end: APPLICATION_END_TIME,
  });
}

export function isMassageApplicationTime(date: Date): boolean {
  return isTimeInWindow({
    date,
    start: { hour: 20, minute: 20 },
    end: APPLICATION_END_TIME,
  });
}
