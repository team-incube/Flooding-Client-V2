"use client";

import type { SearchUser } from "@/entities/user/model/user";
import Gender from "@/shared/asset/svg/Gender";
import Profile from "@/shared/asset/svg/Profile";

interface ManagedStudentCardProps {
  index: number;
  student: SearchUser;
  isSelected: boolean;
  onToggleSelect: (studentId: number) => void;
}

const cardStyles = {
  base: "relative h-[165px] w-[170px] shrink-0 cursor-pointer rounded-2xl p-4 transition-[background-color,box-shadow]",
  banned: {
    selected: "bg-p-2 ring-2 ring-inset ring-negative",
    default: "bg-sub-4 ring-2 ring-inset ring-negative hover:bg-p-2",
  },
  normal: {
    selected: "bg-p-2 ring-2 ring-inset ring-p-1",
    default: "bg-sub-4 hover:bg-p-2",
  },
} as const;

export function ManagedStudentCard({
  index,
  student,
  isSelected,
  onToggleSelect,
}: ManagedStudentCardProps) {
  const variantKey = student.isBanned ? "banned" : "normal";
  const stateKey = isSelected ? "selected" : "default";
  const cardClassName = `${cardStyles.base} ${cardStyles[variantKey][stateKey]}`;

  return (
    <button
      type="button"
      aria-label={`${student.name} 선택`}
      aria-pressed={isSelected}
      onClick={() => onToggleSelect(student.id)}
      className={cardClassName}
    >
      <span className="text-caption-3 text-sub-1 absolute top-4 left-4">
        {index}
      </span>
      {student.isBanned && (
        <span className="text-caption-3 text-negative absolute top-4 right-4">
          금지
        </span>
      )}
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
    </button>
  );
}
