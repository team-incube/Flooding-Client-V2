import { User } from "@/entities/user/model/user";
import Gender from "../asset/svg/Gender";
import Profile from "../asset/svg/Profile";

interface ProfileCardProps {
  index: number;
  student: User;
}

export function ProfileCard({ index, student }: ProfileCardProps) {
  return (
    <div className="relative w-[170px] h-[165px] bg-sub-4 rounded-2xl">
      <span className="absolute top-4 left-4 text-caption-3 text-sub-1">
        {index}
      </span>
      <div className="flex flex-col items-center justify-center gap-2 py-6">
        <div className="w-[64px] h-[64px] flex items-center justify-center">
          <Profile />
        </div>
        <div className="flex items-center">
          <span className="text-text-3 text-main-text">{student.name}</span>
          <Gender
            isActive={student.sex == "WOMAN"}
            size={16}
            color="var(--color-main-text)"
          />
        </div>
        <span className="text-caption-1 text-sub-1">
          {student.studentNumber}
        </span>
      </div>
    </div>
  );
}
