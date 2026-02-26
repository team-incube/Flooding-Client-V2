"use client";

import { usePathname } from "next/navigation";
import { SidebarMenu } from "./sidebarMenu";
import Grid from "@/shared/asset/svg/Grid";
import Bed from "@/shared/asset/svg/Bed";
import School from "@/shared/asset/svg/School";
import Club from "@/shared/asset/svg/Club";
import Logo from "@/shared/asset/svg/Logo";
import Logout from "@/shared/asset/svg/Logout";


export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { title: "홈", href: "/", icon: (active: boolean) => <Grid size={32} isActive={active} /> },
    { title: "기숙사", href: "/dormitory", icon: (active: boolean) => <Bed size={32} isActive={active} /> },
    { title: "학교", href: "/school", icon: (active: boolean) => <School size={32} isActive={active} /> },
    { title: "동아리", href: "/club", icon: (active: boolean) => <Club size={32} isActive={active} /> },
  ];

  return (
    <div className="flex flex-col w-[258px] h-screen bg-[var(--background-surface)] pt-13 pb-14 px-4 justify-between">
      <div className="flex flex-col items-center gap-[47px]">
        <div>
          <Logo />
        </div>
        <nav className="flex flex-col gap-[6px]">
          {menuItems.map((item) => (
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

        <div className="flex items-center h-14 w-[210px] py-3 px-4 cursor-pointer transition-all">
          <div className="flex items-center gap-6">
            <div className="flex shrink-0 items-center justify-center">
              <Logout />
            </div>
            <span className="text-size-text-1 font-[600] text-[var(--color-sub-2)] font-sans">
              로그아웃
            </span>
          </div>
        </div>
      </div>
  );
}