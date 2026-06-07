"use client";

import { useEffect, useState } from "react";
import type { Temporal } from "temporal-polyfill";
import { nowKst } from "@/shared/lib/kst";

export function useCurrentTime(intervalMs = 5_000): Temporal.PlainDateTime {
  const [currentTime, setCurrentTime] = useState(nowKst);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(nowKst());
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs]);

  return currentTime;
}
