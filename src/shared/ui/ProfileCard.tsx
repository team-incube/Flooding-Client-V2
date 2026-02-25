import Gender from "../asset/svg/Gender";
import Profile from "../asset/svg/Profile";

interface BasicProfileCardProps {
  index: number;
  name: string;
  studentId: string;
}

export function BasicProfileCard({
  index,
  name,
  studentId,
}: BasicProfileCardProps) {
  return (
    <div className="relative w-[170px] h-[165px] bg-sub-4 rounded-2xl">
      <span className="absolute top-3 left-4 text-[12px] text-sub-1">
        {index}
      </span>
      <div className="flex flex-col items-center justify-center gap-2 py-6">
        <div className="w-[64px] h-[64px] flex items-center justify-center">
          <Profile />
        </div>
        <div className="flex items-center">
          <span className="font-medium text-main-text">{name}</span>
          <Gender isActive size={16} color="var(--color-main-text)" />
        </div>
        <span className="font-medium text-sm text-sub-1">{studentId}</span>
      </div>
    </div>
  );
}
