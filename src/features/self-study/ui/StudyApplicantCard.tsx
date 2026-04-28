"use client";

import type { DormitoryStudent } from "@/entities/dormitory/model/dormitory";
import Checkbox from "@/shared/asset/svg/Checkbox";
import Gender from "@/shared/asset/svg/Gender";
import Profile from "@/shared/asset/svg/Profile";

interface StudyApplicantCardProps {
  index: number;
  student: DormitoryStudent;
  isChecked: boolean;
  isPending: boolean;
  onCheck: (studentId: number) => void;
}

export function StudyApplicantCard({
  index,
  student,
  isChecked,
  isPending,
  onCheck,
}: StudyApplicantCardProps) {
  const isDisabled = isChecked || isPending;

  return (
    <div className="relative h-[165px] w-[170px] shrink-0 rounded-2xl bg-sub-4 p-4">
      <span className="absolute top-4 left-4 text-caption-3 text-sub-1">
        {index}
      </span>
      <button
        type="button"
        aria-label={`${student.name} 출석 체크`}
        aria-pressed={isChecked}
        disabled={isDisabled}
        onClick={() => onCheck(student.id)}
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors enabled:cursor-pointer enabled:hover:bg-background-surface disabled:cursor-default"
      >
        <Checkbox isActive={isChecked} />
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
