"use client";

import Chair from "@/shared/asset/svg/Chair";
import { ProfileCard } from "@/shared/ui/ProfileCard";
import { TextButton } from "@/shared/ui/Button/TextButton";

const MOCK_MASSAGE_STUDENTS = [
  { index: 1, name: "박건우", studentId: "20501", gender: "male" as const },
  { index: 2, name: "이수진", studentId: "20502", gender: "female" as const },
  { index: 3, name: "김태양", studentId: "10301", gender: "male" as const },
  { index: 4, name: "최아름", studentId: "10302", gender: "female" as const },
  { index: 5, name: "정민호", studentId: "30401", gender: "male" as const },
];

export function MassageChairSection() {
  return (
    <section className="bg-background-surface rounded-2xl p-6 flex flex-col gap-6">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chair />
          <span className="text-main-text font-bold text-[18px]">안마의자</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-[14px]">신청인</span>
          <span className="text-p-1 font-bold text-[14px]">
            {MOCK_MASSAGE_STUDENTS.length}명
          </span>
        </div>
      </div>

      {/* 본문: 카드 행 + 우측 패널 */}
      <div className="flex gap-6">
        {/* 좌측: 1행 프로필 카드 */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-4 flex-wrap">
            {MOCK_MASSAGE_STUDENTS.map((s) => (
              <ProfileCard
                key={s.studentId}
                index={s.index}
                name={s.name}
                studentId={s.studentId}
                gender={s.gender}
              />
            ))}
          </div>
        </div>

        {/* 우측: 신청 패널 */}
        <div className="w-[330px] shrink-0 flex flex-col gap-3 justify-end">
          <TextButton variant="filled" size="wide" onClick={() => {}}>
            신청하기
          </TextButton>
          <p className="text-sub-2 text-[13px]">
            안마의자 신청시간은 20:20 ~ 21:00 입니다
          </p>
          <p className="text-sub-2 text-[13px]">
            ※ 여학생은 여기숙사 별도 신청 바랍니다
          </p>
        </div>
      </div>
    </section>
  );
}
