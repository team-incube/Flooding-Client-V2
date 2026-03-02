"use client";

import { useEffect, useState } from "react";
import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";

export default function Header() {
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
    <header className="flex items-end justify-between mb-6">
      <div className="flex items-end gap-3">
        <span className="text-size-title-2 font-bold text-main-text leading-none">
          홈
        </span>

        <div className="flex items-end gap-2 bg-background-surface rounded-lg px-5 py-2">
          <span className="text-size-title-2 font-bold text-main-text leading-none">
            {time}
          </span>
          <span className="text-size-text-3 text-sub-1 leading-none">
            {date}
          </span>
        </div>
      </div>

      <DarkModeToggle />
    </header>
  );
}
