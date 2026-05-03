"use client";

import { useQuery } from "@tanstack/react-query";
import ProfileSvg from "@/shared/asset/svg/Profile";
import More from "@/shared/asset/svg/MoreVertical";
import { userQueries } from "@/entities/user/api/userQueries";

export default function ProfileCard() {
  const { data: user } = useQuery(userQueries.me());

  return (
    <div className="bg-background-surface flex h-35 w-full items-center gap-6 rounded-2xl p-6 2xl:h-30">
      <div className="flex w-18 items-center justify-center">
        <ProfileSvg />
      </div>
      <div className="flex flex-col">
        <span className="text-title-4 font-medium">
          <span className="hidden 2xl:inline">
            안녕하세요! {user ? `${user.name.slice(1)}님` : ""}
          </span>
          <span className="2xl:hidden">{user?.name ?? ""}</span>
        </span>
        <span className="text-text-3 text-sub-1 font-medium">
          {user?.studentNumber ?? ""}
        </span>
      </div>
      <div className="ml-auto">
        <More />
      </div>
    </div>
  );
}
