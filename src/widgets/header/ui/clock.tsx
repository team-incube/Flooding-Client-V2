"use client";

import { useEffect, useRef, useState } from "react";
import { nowKst } from "@/shared/lib/kst";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Clock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const tick = () => {
      const now = nowKst();
      setTime(`${pad(now.hour)}:${pad(now.minute)}:${pad(now.second)}`);
      setDate(`${String(now.year).slice(2)}.${pad(now.month)}.${pad(now.day)}`);
      timerRef.current = setTimeout(tick, 1000 - now.millisecond);
    };
    tick();
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="bg-background-surface flex items-baseline gap-2 rounded-lg px-5 py-2">
      <span className="text-title-2 text-main-text tabular-nums">{time}</span>
      <span className="text-text-4 text-sub-1">{date}</span>
    </div>
  );
}
