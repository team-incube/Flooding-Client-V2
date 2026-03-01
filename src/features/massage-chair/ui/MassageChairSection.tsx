"use client";

import Chair from "@/shared/asset/svg/Chair";
import { ProfileCard } from "@/shared/ui/ProfileCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { MOCK_STUDENTS } from "@/entities/user/model/mock";

export function MassageChairSection() {
  return (
    <section className="bg-background-surface rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex items-end gap-3">
        <div className="flex items-center gap-2">
          <Chair />
          <span className="text-main-text text-text-1">안마의자</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-caption-1">신청인</span>
          <span className="text-p-1 text-caption-1">
            {MOCK_STUDENTS.slice(0, 5).length}명
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex gap-4 flex-wrap">
            {MOCK_STUDENTS.slice(0, 5).map((student, index) => (
              <ProfileCard
                key={student.id}
                index={index + 1}
                student={student}
              />
            ))}
          </div>
        </div>

        <div className="w-[330px] shrink-0 flex flex-col gap-3 justify-end">
          <TextButton variant="filled" size="wide" onClick={() => {}}>
            신청하기
          </TextButton>
          <p className="text-sub-2 text-caption-2">
            안마의자 신청시간은 20:20 ~ 21:00 입니다
          </p>
          <p className="text-sub-2 text-caption-2">
            ※ 여학생은 여기숙사 별도 신청 바랍니다
          </p>
        </div>
      </div>
    </section>
  );
}
