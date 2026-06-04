import { todayKst } from "@/shared/lib/kst";

export function getInitialMusicDate(): Temporal.PlainDate {
  return todayKst();
}
