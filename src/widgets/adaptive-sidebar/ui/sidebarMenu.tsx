"use client";

import { useState } from "react";
import Link from "next/link";

interface SidebarMenuProps {
  title: string;
  isActive: boolean;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

export function SidebarMenu({ title, isActive, href, icon }: SidebarMenuProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isEffectivelyActive = isActive || isHovered;

  return (
    <Link href={href}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          flex items-center h-14 w-[211px] rounded-2xl py-3 px-4 transition-all cursor-pointer
          ${isActive ? "bg-[var(--color-p-2)]" : "bg-transparent hover:bg-[var(--color-p-2)]"}
        `}
      >
        <div className="flex items-center gap-6">
          <div className="flex shrink-0 items-center justify-center">
            {icon(isEffectivelyActive)}
          </div>
          <span
            className={`
            text-size-text-1 font-[600] font-sans transition-all
            ${isEffectivelyActive ? "text-[var(--color-p-1)]" : "text-[var(--color-sub-2)]"}
          `}
          >
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}