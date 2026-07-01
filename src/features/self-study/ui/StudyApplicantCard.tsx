"use client";

import type { StudyApplicant } from "@/entities/dormitory/model/dormitory";
import CheckCircle from "@/shared/asset/svg/CheckCircle";
import Checkbox from "@/shared/asset/svg/Checkbox";
import Gender from "@/shared/asset/svg/Gender";
import Medal, { isMedalRank } from "@/shared/asset/svg/Medal";
import { UserAvatar } from "@/shared/ui/UserAvatar";

interface StudyApplicantCardProps {
  index: number;
  student: StudyApplicant;
  isChecked: boolean;
  isPending: boolean;
  canCheck?: boolean;
  onToggleCheck: (studentId: number, isChecked: boolean) => void;
}

export function StudyApplicantCard({
  index,
  student,
  isChecked,
  isPending,
  canCheck = false,
  onToggleCheck,
}: StudyApplicantCardProps) {
  return (
    <div className="bg-sub-4 relative h-[165px] w-[170px] shrink-0 rounded-2xl p-4">
      <span className="text-caption-3 text-sub-1 absolute top-4 left-4">
        {index}
      </span>
      {isMedalRank(index) && (
        <Medal rank={index} size={32} className="absolute right-3 bottom-3" />
      )}
      {canCheck && (
        <button
          type="button"
          aria-label={`${student.name} 출석 ${isChecked ? "체크 해제" : "체크"}`}
          aria-pressed={isChecked}
          disabled={isPending}
          onClick={() => onToggleCheck(student.userId, isChecked)}
          className="enabled:hover:bg-background-surface absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-lg enabled:cursor-pointer disabled:cursor-default"
        >
          <Checkbox isActive={isChecked} />
        </button>
      )}
      {canCheck && isChecked && (
        <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center rounded-2xl">
          <CheckCircle />
        </div>
      )}
      <div className="flex h-full flex-col items-center justify-center gap-2">
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
