"use client";

import { useEffect, useState } from "react";

export function useCurrentTime(intervalMs = 5_000): Date {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs]);

  return currentTime;
}
