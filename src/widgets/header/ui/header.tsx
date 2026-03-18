"use client";

import { useEffect, useState } from "react";
import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";
import { getPathLabel } from "@/shared/config/routes";
import { usePathname } from "next/navigation";

export function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const path = usePathname();

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
    <header className="flex items-center justify-between px-8 lg:px-10 2xl:px-18 pt-8 lg:pt-13 pb-6 2xl:pb-8 bg-transparent">
      <div className="flex items-center gap-4">
        <h1 className="text-main-text text-title-2">{getPathLabel(path)}</h1>
        <div className="flex bg-background-surface items-end p-2 gap-2 rounded-lg">
          <span className="tabular-nums text-title-2 text-main-text">
            {time}
          </span>
          <span className="text-text-4 text-sub-1">{date}</span>
        </div>
      </div>
      <DarkModeToggle />
    </header>
  );
}
