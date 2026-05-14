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
  date: Date;
  start: TimeOfDay;
  end: TimeOfDay;
}): boolean {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  return currentMinutes >= toMinutes(start) && currentMinutes < toMinutes(end);
}
