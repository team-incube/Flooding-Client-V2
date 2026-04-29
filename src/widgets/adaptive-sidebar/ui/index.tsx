"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { SidebarMenu } from "./sidebarMenu";
import Grid from "@/shared/asset/svg/Grid";
import Bed from "@/shared/asset/svg/Bed";
import School from "@/shared/asset/svg/School";
import Club from "@/shared/asset/svg/Club";
import Student from "@/shared/asset/svg/Student";
import Logo from "@/shared/asset/svg/Logo";
import Signout from "@/shared/asset/svg/Signout";
import { ROUTES } from "@/shared/config/routes";
import { userQueries } from "@/entities/user/api/userQueries";
import { isManagementRole } from "@/entities/user/lib/userRole";
import type { ReactNode } from "react";

const ICONS: Record<string, (active: boolean) => ReactNode> = {
  "/": (active) => <Grid size={32} isActive={active} />,
  "/dormitory": (active) => <Bed size={32} isActive={active} />,
  "/school": (active) => <School size={32} isActive={active} />,
  "/club": (active) => <Club size={32} isActive={active} />,
  "/students": (active) => <Student size={32} isActive={active} />,
};

const MENU_ITEMS = ROUTES.map(({ href, label }) => ({
  title: label,
  href,
  icon: ICONS[href],
}));

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useQuery(userQueries.me());
  const menuItems = MENU_ITEMS.filter(
    ({ href }) => href !== "/students" || isManagementRole(user?.role),
  );
  const isRouteActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    router.push("/signin");
  };

  return (
    <div className="flex flex-col w-[112px] lg:w-[240px] 2xl:w-[260px] h-screen bg-background-surface pt-13 pb-14 px-4 justify-between">
      <div className="flex flex-col items-center gap-[47px]">
        <div>
          <div className="hidden lg:block">
            <Logo />
          </div>
          <div className="block lg:hidden">
            <Logo iconOnly />
          </div>
        </div>
        <nav className="flex flex-col gap-[6px] w-full">
          {menuItems.map((item) => (
            <SidebarMenu
              key={item.href}
              title={item.title}
              href={item.href}
              isActive={isRouteActive(item.href)}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="flex items-center justify-center lg:justify-start h-14 w-full py-3 lg:px-4 cursor-pointer transition-all"
        onClick={handleLogout}
      >
        <div className="flex items-center gap-6">
          <div className="flex shrink-0 items-center justify-center">
            <Signout size={32} />
          </div>
          <span className="hidden lg:block text-text-1 text-sub-2">
            로그아웃
          </span>
        </div>
      </button>
    </div>
  );
}
