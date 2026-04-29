"use client";

import { useQuery } from "@tanstack/react-query";
import ProfileSvg from "@/shared/asset/svg/Profile";
import More from "@/shared/asset/svg/MoreVertical";
import { userQueries } from "@/entities/user/api/userQueries";

export default function ProfileCard() {
  const { data: user } = useQuery(userQueries.me());

  return (
    <div className="flex items-center gap-6 p-6 bg-background-surface rounded-2xl w-full h-35 2xl:h-30">
      <div className="w-18 flex items-center justify-center">
        <ProfileSvg />
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-title-4">
          <span className="hidden 2xl:inline">
            안녕하세요! {user ? `${user.name.slice(1)}님` : ""}
          </span>
          <span className="2xl:hidden">{user?.name ?? ""}</span>
        </span>
        <span className="text-text-3 font-medium text-sub-1">
          {user?.studentNumber ?? ""}
        </span>
      </div>
      <div className="ml-auto">
        <More />
      </div>
    </div>
  );
}
