"use client";

import Link from "next/link";

interface SidebarMenuProps {
  title: string;
  isActive: boolean;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

export function SidebarMenu({ title, isActive, href, icon }: SidebarMenuProps) {
  return (
    <Link href={href}>
      <div
        className={`
          group flex items-center h-14 w-[211px] rounded-2xl py-3 px-4 transition-all cursor-pointer
          ${isActive ? "bg-[var(--color-p-2)]" : "bg-transparent hover:bg-[var(--color-p-2)]"}
        `}
      >
        <div className="flex items-center gap-6">
          <div className="relative flex shrink-0 items-center justify-center">
            {isActive ? (
              icon(true)
            ) : (
              <>
                <div className="block group-hover:hidden">
                  {icon(false)}
                </div>
                <div className="hidden group-hover:block">
                  {icon(true)}
                </div>
              </>
            )}
          </div>
          <span
            className={`
              text-size-text-1 font-[600] font-sans transition-all
              ${isActive 
                ? "text-[var(--color-p-1)]" 
                : "text-[var(--color-sub-2)] group-hover:text-[var(--color-p-1)]"
              }
            `}
          >
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}