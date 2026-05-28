"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { SidebarMenu } from "./sidebarMenu";
import Logo from "@/shared/asset/svg/Logo";
import Link from "next/link";
import { userQueries } from "@/entities/user/api/userQueries";
import { createStudyPermission } from "@/entities/dormitory/lib/studyPermission";
import { SignOutButton } from "@/features/sign-out/ui/SignOutButton";
import { MENU_ITEMS } from "../config/menuItems";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useQuery(userQueries.me());
  const studyPermission = createStudyPermission({ role: user?.role });
  const menuItems = MENU_ITEMS.filter(
    ({ href }) => href !== "/students" || studyPermission.canManage,
  );
  const isCurrentRoute = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

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
              isActive={isCurrentRoute(item.href)}
              icon={item.icon}
            />
          ))}
        </nav>
      </div>

      <SignOutButton />
    </div>
  );
}
