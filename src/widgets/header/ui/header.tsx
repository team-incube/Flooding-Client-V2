"use client";

import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";
import { getRouteLabel } from "@/shared/lib/getRouteLabel";
import { usePathname } from "next/navigation";
import { Clock } from "./clock";

export function Header() {
  const path = usePathname();

  return (
    <header className="flex items-center justify-between bg-transparent px-8 pt-8 pb-6 lg:px-10 lg:pt-13 2xl:px-18 2xl:pb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-main-text text-title-2">{getRouteLabel(path)}</h1>
        <Clock />
      </div>
      <DarkModeToggle />
    </header>
  );
}
