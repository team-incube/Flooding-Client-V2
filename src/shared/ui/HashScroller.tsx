"use client";

import { useEffect } from "react";

const RETRY_DELAYS = [0, 200, 500, 900];

/**
 * URL 해시(#id)에 해당하는 요소로 스크롤한다.
 * 대상 섹션이 비동기(Suspense)로 로드되며 높이가 변하므로,
 * 여러 시점에 재시도해 최종 위치가 어긋나지 않게 한다.
 */
export function HashScroller() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    const scrollToTarget = () => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const timers = RETRY_DELAYS.map((delay) =>
      window.setTimeout(scrollToTarget, delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return null;
}
