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
    return <div className="h-[39px] w-[70px]" />;
  }

  return (
    <button
      onClick={toggle}
      className={`relative flex h-[39px] w-[70px] cursor-pointer items-center rounded-[43px] p-1 transition-colors duration-300 ${
        isDark ? "bg-background-surface" : "bg-sub-3"
      }`}
    >
      <span
        className={`flex h-[31px] w-[31px] items-center justify-center rounded-full transition-transform duration-300 ${
          isDark ? "bg-sub-1 translate-x-[30px]" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon /> : <Sun />}
      </span>
    </button>
  );
}
