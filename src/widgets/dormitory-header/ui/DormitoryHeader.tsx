"use client";

import { useEffect, useState } from "react";
import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";

export function DormitoryHeader() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);

      const yy = String(now.getFullYear()).slice(2);
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      setDate(`${yy}.${mo}.${dd}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-background-surface border-b border-sub-3">
      <div className="flex items-center gap-4">
        <h1 className="text-main-text font-bold text-[24px]">기숙사</h1>
        <div className="flex items-center gap-2 text-sub-1 text-[15px]">
          <span className="tabular-nums">{time}</span>
          <span className="text-sub-3">|</span>
          <span>{date}</span>
        </div>
      </div>
      <DarkModeToggle />
    </header>
  );
}
