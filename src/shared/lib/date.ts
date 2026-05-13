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
