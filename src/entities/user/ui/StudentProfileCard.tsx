import type { User } from "@/entities/user/model/user";
import Gender from "@/shared/asset/svg/Gender";
import { UserAvatar } from "@/shared/ui/UserAvatar";

type StudentProfileCardStudent = Pick<
  User,
  "name" | "studentNumber" | "sex" | "profileImageUrl"
>;

interface StudentProfileCardProps {
  index: number;
  student: StudentProfileCardStudent;
}

export function StudentProfileCard({
  index,
  student,
}: StudentProfileCardProps) {
  return (
    <div className="bg-sub-4 relative h-[165px] w-[170px] rounded-2xl">
      <span className="text-caption-3 text-sub-1 absolute top-4 left-4">
        {index}
      </span>
      <div className="flex flex-col items-center justify-center gap-2 py-6">
        <UserAvatar imageUrl={student.profileImageUrl} className="size-16" />
        <div className="flex items-center">
          <span className="text-text-3 text-main-text">{student.name}</span>
          <Gender
            isActive={student.sex === "WOMAN"}
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
