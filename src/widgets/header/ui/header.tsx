"use client";

import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";
import { getPathLabel } from "@/shared/config/routes";
import { usePathname } from "next/navigation";
import { Clock } from "./clock";

export function Header() {
  const path = usePathname();

  return (
    <header className="flex items-center justify-between px-8 lg:px-10 2xl:px-18 pt-8 lg:pt-13 pb-6 2xl:pb-8 bg-transparent">
      <div className="flex items-center gap-4">
        <h1 className="text-main-text text-title-2">{getPathLabel(path)}</h1>
        <Clock />
      </div>
      <DarkModeToggle />
    </header>
  );
}
