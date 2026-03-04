"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarMenu } from "./sidebarMenu";
import Grid from "@/shared/asset/svg/Grid";
import Bed from "@/shared/asset/svg/Bed";
import School from "@/shared/asset/svg/School";
import Club from "@/shared/asset/svg/Club";
import Logo from "@/shared/asset/svg/Logo";
import Logout from "@/shared/asset/svg/Logout";
import { ROUTES } from "@/shared/config/routes";
import type { ReactNode } from "react";

const ICONS: Record<string, (active: boolean) => ReactNode> = {
  "/": (active) => <Grid size={32} isActive={active} />,
  "/dormitory": (active) => <Bed size={32} isActive={active} />,
  "/school": (active) => <School size={32} isActive={active} />,
  "/club": (active) => <Club size={32} isActive={active} />,
};

const MENU_ITEMS = ROUTES.map(({ href, label }) => ({
  title: label,
  href,
  icon: ICONS[href],
}));

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <div className="flex flex-col w-[258px] h-screen bg-background-surface pt-13 pb-14 px-4 justify-between">
      <div className="flex flex-col items-center gap-[47px]">
        <div>
          <Logo />
        </div>
        <nav className="flex flex-col gap-[6px]">
          {MENU_ITEMS.map((item) => (
            <SidebarMenu
              key={item.href}
              title={item.title}
              href={item.href}
              isActive={pathname === item.href}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="flex items-center h-14 w-[210px] py-3 px-4 cursor-pointer transition-all"
        onClick={handleLogout}
      >
        <div className="flex items-center gap-6">
          <div className="flex shrink-0 items-center justify-center">
            <Logout size={32} />
          </div>
          <span className="text-text-1 text-sub-2 font-sans">로그아웃</span>
        </div>
      </button>
    </div>
  );
}
