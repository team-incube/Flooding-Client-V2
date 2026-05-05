"use client";

import { useEffect, useRef, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Clock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      );
      setDate(
        `${String(now.getFullYear()).slice(2)}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`,
      );
      timerRef.current = setTimeout(tick, 1000 - now.getMilliseconds());
    };
    tick();
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="bg-background-surface flex items-end gap-2 rounded-lg p-2">
      <span className="text-title-2 text-main-text tabular-nums">{time}</span>
      <span className="text-text-4 text-sub-1">{date}</span>
    </div>
  );
}
