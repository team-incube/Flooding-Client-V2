"use client";

import Link from "next/link";

interface SidebarDrawerMenuProps {
  title: string;
  isActive: boolean;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

export function SidebarDrawerMenu({
  title,
  isActive,
  href,
  icon,
}: SidebarDrawerMenuProps) {
  return (
    <Link href={href}>
      <div
        className={`group flex h-14 w-full cursor-pointer items-center rounded-2xl px-4 py-3 ${isActive ? "bg-p-2" : "hover:bg-p-2 bg-transparent"} `}
      >
        <div className="grid w-full grid-cols-[32px_minmax(0,1fr)] items-center gap-6">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            {isActive ? (
              icon(true)
            ) : (
              <>
                <div className="block group-hover:hidden">{icon(false)}</div>
                <div className="hidden group-hover:block">{icon(true)}</div>
              </>
            )}
          </div>
          <span
            className={`text-text-1 ${isActive ? "text-p-1" : "text-sub-2 group-hover:text-p-1"} `}
          >
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}
