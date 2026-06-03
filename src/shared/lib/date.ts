interface FormatDateParamOptions {
  hour?: boolean;
  minute?: boolean;
}

type DateLike = Temporal.PlainDate | Temporal.PlainDateTime;

function hasTime(date: DateLike): date is Temporal.PlainDateTime {
  return "hour" in date;
}

export function formatDateParam(
  date: DateLike,
  options: FormatDateParamOptions = {},
): string {
  const year = date.year;
  const month = String(date.month).padStart(2, "0");
  const day = String(date.day).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const timeParts = hasTime(date)
    ? [
        options.hour && String(date.hour).padStart(2, "0"),
        options.minute && String(date.minute).padStart(2, "0"),
      ].filter(Boolean)
    : [];

  if (timeParts.length === 0) {
    return formattedDate;
  }

  return `${formattedDate} ${timeParts.join(":")}`;
}

export const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDisplayDate(date: DateLike): string {
  const yy = String(date.year).slice(2);
  const mm = String(date.month).padStart(2, "0");
  const dd = String(date.day).padStart(2, "0");
  // Temporal의 dayOfWeek는 1(월)~7(일) → DAYS(0=일)에 맞춰 매핑
  const day = DAYS[date.dayOfWeek % 7];
  return `${yy}.${mm}.${dd} (${day})`;
}

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
