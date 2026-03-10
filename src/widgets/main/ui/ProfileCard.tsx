import { ReactNode } from "react";
import ProfileSvg from "@/shared/asset/svg/Profile";
import More from "@/shared/asset/svg/MoreVertical";
import { User } from "@/entities/user/model/user";

interface ProfileCardProps {
  photo?: ReactNode;
  user?: User;
}

export default function ProfileCard({ photo, user }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-6 p-6 bg-background-surface rounded-2xl w-full h-35 2xl:w-120 2xl:h-30">
      <div className="w-18 flex items-center justify-center">
        {photo ?? <ProfileSvg />}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-title-4">{user?.name ?? ""}</span>
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
