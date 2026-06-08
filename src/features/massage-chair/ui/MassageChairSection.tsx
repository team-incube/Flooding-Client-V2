"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Chair from "@/shared/asset/svg/Chair";
import { createApplicationActionState } from "@/entities/dormitory/lib/applicationActionState";
import { sortByOrder } from "@/entities/dormitory/lib/sortByOrder";
import { MASSAGE_CAPACITY } from "@/entities/dormitory/model/constants";
import { ProfileCard } from "@/entities/user/ui/ProfileCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
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
  const applicants = sortByOrder(massageApplicants?.applicants ?? []);
  const isApplicationOpen = massageApplicants?.isApplicationOpen ?? false;
  const applyMutation = useApplyMassage();
  const cancelMutation = useCancelMassage();
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
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
    isFull: applicants.length >= MASSAGE_CAPACITY,
  });

  const handleApplyMassage = () => {
    if (!massageActionState.canApply) {
      return;
    }

    applyMutation.mutate();
  };

  const handleOpenCancelConfirm = () => {
    if (!massageActionState.canCancel) {
      return;
    }

    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancelMassage = () => {
    if (!massageActionState.canCancel) {
      return;
    }

    cancelMutation.mutate(undefined, {
      onSuccess: () => {
        setIsCancelConfirmOpen(false);
      },
    });
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
          <NoteTooltip
            notes={MASSAGE_NOTES}
            ariaLabel="안마의자 안내 보기"
            className="lg:hidden"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-caption-1">신청인</span>
          <span className="text-p-1 text-caption-1">{applicants.length}명</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:justify-end">
        {applicants.length > 0 && (
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
        )}

        <div className="flex w-full flex-col justify-end gap-3 lg:w-[330px] lg:shrink-0">
          <TextButton
            variant={
              massageActionState.isActionDisabled ? "disabled" : "filled"
            }
            size="wide"
            className="w-full"
            disabled={massageActionState.isActionDisabled}
            onClick={
              hasAppliedMassage ? handleOpenCancelConfirm : handleApplyMassage
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
          <div className="hidden min-w-0 flex-col gap-0.5 lg:flex">
            <NoteText>※ 안마의자 신청시간은 20:20 ~ 21:00 입니다</NoteText>
            <NoteText>※ 여학생은 여기숙사 별도 신청 바랍니다</NoteText>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={isCancelConfirmOpen}
        title="안마의자 신청 취소"
        titleVariant="negative"
        description="정말 안마의자 신청을 취소하시겠어요?"
        confirmLabel="취소하기"
        confirmVariant="negative"
        isPending={cancelMutation.isPending}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleConfirmCancelMassage}
      />
    </section>
  );
}
