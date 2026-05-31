"use client";

import { useQuery } from "@tanstack/react-query";
import Chair from "@/shared/asset/svg/Chair";
import { createApplicationActionState } from "@/entities/dormitory/lib/applicationActionState";
import { ProfileCard } from "@/entities/user/ui/ProfileCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { NoteText } from "@/shared/ui/NoteText";
import { NoteTooltip } from "@/shared/ui/NoteTooltip";
import { useApplyMassage } from "../model/useApplyMassage";
import { useCancelMassage } from "../model/useCancelMassage";

const MASSAGE_NOTES = [
  "※ 안마의자 신청시간은 20:20 ~ 21:00 입니다",
  "※ 여학생은 여기숙사 별도 신청 바랍니다",
];

export function MassageChairSection() {
  const massageQuery = dormitoryQueries.massage();
  const { data: massageApplicants, isLoading: isMassageLoading } =
    useQuery(massageQuery);
  const applicants = massageApplicants?.applicants ?? [];
  const isApplicationOpen = massageApplicants?.isApplicationOpen ?? false;
  const applyMutation = useApplyMassage();
  const cancelMutation = useCancelMassage();
  const hasAppliedMassage =
    massageApplicants?.myApplicationStatus === "APPLIED";
  const isMassageCancelled =
    massageApplicants?.myApplicationStatus === "CANCELLED";
  const massageActionState = createApplicationActionState({
    hasApplied: hasAppliedMassage,
    isUserLoading: false,
    isDataLoading: isMassageLoading,
    isCancelled: isMassageCancelled,
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
    <section
      className="bg-background-surface relative flex flex-col gap-6 rounded-2xl p-5 sm:p-6"
      data-tooltip-card
    >
      <div className="flex items-end gap-3">
        <div className="flex items-center gap-2">
          <Chair />
          <span className="text-main-text text-text-1">안마의자</span>
          <NoteTooltip notes={MASSAGE_NOTES} ariaLabel="안마의자 안내 보기" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-caption-1">신청인</span>
          <span className="text-p-1 text-caption-1">{applicants.length}명</span>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-6 sm:flex-row">
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

        <div className="flex w-full flex-col justify-end gap-3 sm:w-[330px] sm:shrink-0">
          <TextButton
            variant={
              massageActionState.isActionDisabled ? "disabled" : "filled"
            }
            size="wide"
            className="w-full"
            disabled={massageActionState.isActionDisabled}
            onClick={
              hasAppliedMassage ? handleCancelMassage : handleApplyMassage
            }
          >
            {isMassageLoading
              ? "확인 중"
              : hasAppliedMassage
                ? "취소하기"
                : massageActionState.isApplyDisabled
                  ? "신청 불가"
                  : "신청하기"}
          </TextButton>
          <div className="hidden min-w-0 flex-col gap-0.5 sm:flex">
            <NoteText>※ 안마의자 신청시간은 20:20 ~ 21:00 입니다</NoteText>
            <NoteText>※ 여학생은 여기숙사 별도 신청 바랍니다</NoteText>
          </div>
        </div>
      </div>
    </section>
  );
}
