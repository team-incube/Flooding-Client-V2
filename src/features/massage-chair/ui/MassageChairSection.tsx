"use client";

import { useQuery } from "@tanstack/react-query";
import Chair from "@/shared/asset/svg/Chair";
import { createApplicationActionState } from "@/entities/dormitory/lib/applicationActionState";
import { ProfileCard } from "@/entities/user/ui/ProfileCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { useApplyMassage } from "../model/useApplyMassage";
import { useCancelMassage } from "../model/useCancelMassage";

export function MassageChairSection() {
  const massageQuery = dormitoryQueries.massage();
  const { data: massageApplicants, isLoading: isMassageLoading } =
    useQuery(massageQuery);
  const applicants = massageApplicants?.applicants ?? [];
  const isApplicationOpen = massageApplicants?.isApplicationOpen ?? false;
  const { data: user, isLoading: isUserLoading } = useQuery(userQueries.me());
  const applyMutation = useApplyMassage();
  const cancelMutation = useCancelMassage();
  const hasAppliedMassage =
    user !== undefined &&
    applicants.some((student) => student.studentNumber === user.studentNumber);
  const massageActionState = createApplicationActionState({
    hasApplied: hasAppliedMassage,
    isUserLoading,
    isDataLoading: isMassageLoading,
    isActionPending: applyMutation.isPending || cancelMutation.isPending,
    isApplicationOpen,
  });

  const handleApplyMassage = () => {
    if (!massageActionState.canApply) {
      return;
    }

    applyMutation.mutate();
  };

  const handleCancelMassage = () => {
    if (!massageActionState.canCancel) {
      return;
    }

    cancelMutation.mutate();
  };

  return (
    <section className="bg-background-surface flex flex-col gap-6 rounded-2xl p-6">
      <div className="flex items-end gap-3">
        <div className="flex items-center gap-2">
          <Chair />
          <span className="text-main-text text-text-1">안마의자</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-caption-1">신청인</span>
          <span className="text-p-1 text-caption-1">{applicants.length}명</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-4">
            {applicants.map((student) => (
              <ProfileCard
                key={student.studentNumber}
                index={student.order}
                student={student}
              />
            ))}
          </div>
        </div>

        <div className="flex w-[330px] shrink-0 flex-col justify-end gap-3">
          <TextButton
            variant={
              massageActionState.isActionDisabled ? "disabled" : "filled"
            }
            size="wide"
            disabled={massageActionState.isActionDisabled}
            onClick={
              hasAppliedMassage ? handleCancelMassage : handleApplyMassage
            }
          >
            {isUserLoading || isMassageLoading
              ? "확인 중"
              : hasAppliedMassage
                ? "취소하기"
                : !isApplicationOpen
                  ? "신청 불가"
                  : "신청하기"}
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
