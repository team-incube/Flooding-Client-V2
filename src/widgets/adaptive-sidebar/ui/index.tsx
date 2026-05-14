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
import Link from "next/link";
import { ROUTES } from "@/shared/config/routes";
import { userQueries } from "@/entities/user/api/userQueries";
import { createStudyPermission } from "@/entities/user/lib/permission";
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
  const studyPermission = createStudyPermission({ role: user?.role });
  const menuItems = MENU_ITEMS.filter(
    ({ href }) => href !== "/students" || studyPermission.canManage,
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
    <div className="bg-background-surface flex h-screen w-[112px] flex-col justify-between px-4 py-13 lg:w-[240px] 2xl:w-[260px]">
      <div className="flex flex-col items-center gap-[47px]">
        <Link href="/">
          <div className="hidden lg:block">
            <Logo />
          </div>
          <div className="block lg:hidden">
            <Logo iconOnly />
          </div>
        </Link>
        <nav className="flex w-full flex-col gap-[6px]">
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
        className="flex h-14 w-full cursor-pointer items-center justify-center py-3"
        onClick={handleLogout}
      >
        <div className="flex items-center gap-6">
          <div className="flex shrink-0 items-center justify-center">
            <Signout size={32} />
          </div>
          <span className="text-text-1 text-sub-2 hidden lg:block">
            로그아웃
          </span>
        </div>
      </button>
    </div>
  );
}
