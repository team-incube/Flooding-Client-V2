import { PERIOD_TIMES } from "@/entities/neis/model/neis";

export function getCurrentPeriod(): number | null {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  for (const [period, [start, end]] of Object.entries(PERIOD_TIMES)) {
    if (hhmm >= start && hhmm <= end) return Number(period);
  }
  return null;
}
