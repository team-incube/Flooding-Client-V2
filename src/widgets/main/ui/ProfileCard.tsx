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
    <div className="flex items-center gap-6 p-4 bg-background-surface rounded-2xl w-full">
      <div className="w-[72px] h-[72px] flex items-center justify-center">
        {photo ?? <ProfileSvg />}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-title-4">
          안녕하세요! {user?.name ?? ""}님
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
