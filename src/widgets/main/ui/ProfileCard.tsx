import { ReactNode } from "react";
import ProfileSvg from "@/shared/asset/svg/Profile";
import More from "@/shared/asset/svg/MoreVertical";

interface ProfileCardProps {
  photo?: ReactNode;
}

export default function ProfileCard({ photo }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-6 p-4 min-[1600px]:p-6 bg-background-surface rounded-2xl w-[480px]">
      <div className="w-[72px] h-[72px] flex items-center justify-center">
        {photo ?? <ProfileSvg />}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-title-2">
          안녕하세요! 민솔님
        </span>
        <span className="text-text-3 font-medium text-sub-1">2403</span>
      </div>
      <div className="ml-auto">
        <More />
      </div>
    </div>
  );
}
