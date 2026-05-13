"use client";

import type { SearchUser } from "@/entities/user/model/user";
import Checkbox from "@/shared/asset/svg/Checkbox";
import Gender from "@/shared/asset/svg/Gender";
import Profile from "@/shared/asset/svg/Profile";

interface ManagedStudentCardProps {
  index: number;
  student: SearchUser;
  isSelected: boolean;
  onToggleSelect: (studentId: number) => void;
}

export function ManagedStudentCard({
  index,
  student,
  isSelected,
  onToggleSelect,
}: ManagedStudentCardProps) {
  const cardStyles = isSelected
    ? "bg-p-2 ring-2 ring-inset ring-p-1"
    : "bg-sub-4 hover:bg-p-2";

  return (
    <div
      className={`relative h-[165px] w-[170px] shrink-0 rounded-2xl p-4 transition-[background-color,box-shadow] ${cardStyles}`}
    >
      <span className="text-caption-3 text-sub-1 absolute top-4 left-4">
        {index}
      </span>
      <button
        type="button"
        aria-label={`${student.name} 선택`}
        aria-pressed={isSelected}
        onClick={() => onToggleSelect(student.id)}
        className="hover:bg-background-surface absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
      >
        <Checkbox isActive={isSelected} />
      </button>
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div className="flex h-[64px] w-[64px] items-center justify-center">
          <Profile />
        </div>
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
