const WAKE_UP_HOUR = 7;
const WAKE_UP_MINUTE = 25;

export function getInitialMusicDate(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 60 * 60 * 1000);

  const isBeforeWakeUp =
    kst.getHours() < WAKE_UP_HOUR ||
    (kst.getHours() === WAKE_UP_HOUR && kst.getMinutes() < WAKE_UP_MINUTE);

  if (isBeforeWakeUp) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return yesterday;
  }

  return now;
}
