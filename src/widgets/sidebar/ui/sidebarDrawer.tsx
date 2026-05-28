"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { userQueries } from "@/entities/user/api/userQueries";
import { createStudyPermission } from "@/entities/dormitory/lib/studyPermission";
import { useSignOut } from "@/features/sign-out/lib/useSignOut";
import Logo from "@/shared/asset/svg/Logo";
import Signout from "@/shared/asset/svg/Signout";
import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";
import { MENU_ITEMS } from "../config/menuItems";
import { SidebarDrawerMenu } from "./sidebarDrawerMenu";
import { getRoleLabel } from "@/entities/user/lib/userRole";
import Profile from "@/shared/asset/svg/Profile";

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarDrawer({ isOpen, onClose }: SidebarDrawerProps) {
  const pathname = usePathname();
  const { data: user } = useQuery(userQueries.me());
  const roleLabel = getRoleLabel(user?.role);
  const { handleSignout } = useSignOut();

  const studyPermission = createStudyPermission({ role: user?.role });
  const menuItems = MENU_ITEMS.filter(
    ({ href }) => href !== "/students" || studyPermission.canManage,
  );
  const isCurrentRoute = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="sm:hidden">
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`bg-background-surface fixed top-0 right-0 z-60 flex h-dvh min-w-75 flex-col justify-between rounded-tl-3xl rounded-bl-3xl px-6 py-10 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex w-full items-center gap-4 rounded-2xl">
              <div className="flex w-14 items-center justify-center">
                <Profile />
              </div>
              <div className="flex flex-col">
                <span className="text-title-4 font-medium">
                  <span className="hidden 2xl:inline">
                    안녕하세요! {user ? `${user.name.slice(1)}님` : ""}
                  </span>
                  <span className="2xl:hidden">{user?.name ?? ""}</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-text-3 text-sub-1 font-medium">
                    {user?.studentNumber ?? ""}
                  </span>
                  {roleLabel && (
                    <span className="text-text-3 text-negative font-medium">
                      {roleLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <DarkModeToggle />
          </div>

          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <SidebarDrawerMenu
                key={item.href}
                title={item.title}
                href={item.href}
                isActive={isCurrentRoute(item.href)}
                icon={item.icon}
              />
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={handleSignout}
          className="flex h-14 w-full cursor-pointer items-center justify-center px-4 py-3"
        >
          <div className="flex items-center gap-6">
            <div className="flex shrink-0 items-center justify-center">
              <Signout size={32} />
            </div>
            <span className="text-text-1 text-sub-2">로그아웃</span>
          </div>
        </button>
      </aside>
    </div>
  );
}
