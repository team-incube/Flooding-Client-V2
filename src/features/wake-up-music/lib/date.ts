import { nowKst, todayKst } from "@/shared/lib/kst";

const WAKE_UP_HOUR = 7;
const WAKE_UP_MINUTE = 25;

export function getInitialMusicDate(): Temporal.PlainDate {
  const now = nowKst();

  const isBeforeWakeUp =
    now.hour < WAKE_UP_HOUR ||
    (now.hour === WAKE_UP_HOUR && now.minute < WAKE_UP_MINUTE);

  if (isBeforeWakeUp) {
    return todayKst().subtract({ days: 1 });
  }

  return todayKst();
}
