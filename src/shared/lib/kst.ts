import { Temporal } from "temporal-polyfill";

const KST_TIME_ZONE = "Asia/Seoul";

/**
 * 실행 환경(브라우저/SSR Node)의 타임존과 무관하게 KST 벽시계를 반환한다.
 */
export function nowKst(): Temporal.PlainDateTime {
  return Temporal.Now.plainDateTimeISO(KST_TIME_ZONE);
}

/**
 * 환경 타임존과 무관한 KST 기준 오늘 날짜를 반환한다.
 */
export function todayKst(): Temporal.PlainDate {
  return Temporal.Now.plainDateISO(KST_TIME_ZONE);
}

/**
 * 백엔드가 주는 오프셋 없는 KST 벽시계 문자열을 파싱한다.
 * 추가 타임존 보정 없이 그대로 KST로 해석하며, 잘못된 값이면 null을 반환한다.
 */
export function parseKstWallClock(
  value: string,
): Temporal.PlainDateTime | null {
  try {
    return Temporal.PlainDateTime.from(value);
  } catch {
    return null;
  }
}

/**
 * 자정 기준 분(minute) 값으로 변환한다. (시간 구간 비교용)
 */
export function minutesOfDay(dateTime: Temporal.PlainDateTime): number {
  return dateTime.hour * 60 + dateTime.minute;
}
