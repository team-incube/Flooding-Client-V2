"use client";

import Moon from "@/shared/asset/svg/Moon";
import Sun from "@/shared/asset/svg/Sun";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    if (isDark === null) return;
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (isDark === null) {
    return <div className="w-[70px] h-[39px]" />;
  }

  return (
    <button
      onClick={toggle}
      className={`relative w-[70px] h-[39px] rounded-[43px] transition-colors duration-300 cursor-pointer flex items-center p-1 ${
        isDark ? "bg-background-surface" : "bg-sub-3"
      }`}
    >
      <span
        className={`w-[31px] h-[31px] rounded-full flex items-center justify-center transition-transform duration-300 ${
          isDark ? "bg-sub-1 translate-x-[30px]" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon /> : <Sun />}
      </span>
    </button>
  );
}
