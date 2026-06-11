"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import More from "@/shared/asset/svg/MoreVertical";
import { UserAvatar } from "@/shared/ui/UserAvatar";
import { userQueries } from "@/entities/user/api/userQueries";
import { getGreetingName, getRoleLabel } from "@/entities/user/lib/userRole";
import { ProfileImageUploadModal } from "@/features/profile-image/ui/ProfileImageUploadModal";

export default function MyProfileCard() {
  const { data: user } = useQuery(userQueries.me());
  const roleLabel = getRoleLabel(user?.role);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="bg-background-surface flex h-24 w-full items-center gap-4 rounded-2xl p-6 sm:h-35 sm:gap-6 sm:p-6 2xl:h-30">
      <UserAvatar
        imageUrl={user?.profileImageUrl}
        className="size-14 sm:size-18"
      />

      <div className="flex flex-col">
        <span className="text-title-4 font-medium">
          <span className="hidden 2xl:inline">
            안녕하세요! {getGreetingName(user)}
          </span>
          <span className="2xl:hidden">{user?.name ?? ""}</span>
        </span>
        <div className="flex items-center gap-1">
          <span className="text-text-3 text-sub-1 font-medium">
            {user?.studentNumber ?? ""}
          </span>
          {roleLabel && (
            <span
              className={`text-text-3 ${user?.role === "GENERAL_STUDENT" ? "text-sub-1" : "text-negative"} font-medium`}
            >
              {roleLabel}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleOpenModal}
        className="ml-auto hidden cursor-pointer sm:block"
        aria-label="프로필 사진 등록"
      >
        <More />
      </button>

      {isModalOpen && <ProfileImageUploadModal onClose={handleCloseModal} />}
    </div>
  );
}
