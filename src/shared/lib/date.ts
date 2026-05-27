interface FormatDateParamOptions {
  hour?: boolean;
  minute?: boolean;
}

export function formatDateParam(
  date: Date,
  options: FormatDateParamOptions = {},
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const timeParts = [
    options.hour && String(date.getHours()).padStart(2, "0"),
    options.minute && String(date.getMinutes()).padStart(2, "0"),
  ].filter(Boolean);

  if (timeParts.length === 0) {
    return formattedDate;
  }

  return `${formattedDate} ${timeParts.join(":")}`;
}

export const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDisplayDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const day = DAYS[date.getDay()];
  return `${yy}.${mm}.${dd} (${day})`;
}
