"use client";

import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";
import { getRouteLabel } from "@/shared/lib/getRouteLabel";
import { usePathname } from "next/navigation";
import Logo from "@/shared/asset/svg/Logo";
import Menu from "@/shared/asset/svg/Menu";
import { Clock } from "./clock";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const path = usePathname();

  return (
    <header>
      <div className="flex flex-col items-start gap-4 bg-transparent px-5 pt-6 pb-4 sm:hidden">
        <div className="flex w-full items-center justify-between">
          <Link href="/">
            <Logo height={36} />
          </Link>

          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-11 w-11 cursor-pointer items-center justify-center"
            aria-label="메뉴 열기"
          >
            <Menu size={28} />
          </button>
        </div>
        <Clock />
      </div>

      <div className="hidden items-center justify-between bg-transparent px-8 pt-8 pb-6 sm:flex lg:px-10 lg:pt-13 2xl:px-18 2xl:pb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-main-text text-title-2">{getRouteLabel(path)}</h1>
          <Clock />
        </div>
        <DarkModeToggle />
      </div>
    </header>
  );
}
