import { PERIOD_TIMES } from "@/entities/neis/model/neis";
import { nowKst } from "@/shared/lib/kst";

export function getCurrentPeriod(): number | null {
  const now = nowKst();
  const hhmm = `${String(now.hour).padStart(2, "0")}:${String(now.minute).padStart(2, "0")}`;
  for (const [period, [start, end]] of Object.entries(PERIOD_TIMES)) {
    if (hhmm >= start && hhmm <= end) return Number(period);
  }
  return null;
}
