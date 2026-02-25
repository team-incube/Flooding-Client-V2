"use client";

import Moon from "@/shared/asset/svg/Moon";
import Sun from "@/shared/asset/svg/Sun";
import { useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggle = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggle}
      className={`relative w-[70px] h-[39px] rounded-[43px] transition-colors duration-300 cursor-pointer flex items-center p-1 ${
        isDark ? "bg-(--background-surface)" : "bg-(--color-sub-3)"
      }`}
    >
      <span
        className={`w-[31px] h-[31px] rounded-full flex items-center justify-center transition-transform duration-300 ${
          isDark ? "bg-(--color-sub-1) translate-x-[30px]" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon /> : <Sun />}
      </span>
    </button>
  );
}
