"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ChairIcon from "@/shared/asset/svg/Chair";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { createApplicationActionState } from "@/entities/dormitory/lib/applicationActionState";
import { MASSAGE_CAPACITY } from "@/entities/dormitory/model/constants";
import { useApplyMassage } from "@/features/massage-chair/model/useApplyMassage";
import { useCancelMassage } from "@/features/massage-chair/model/useCancelMassage";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import ApplyCard from "./ApplyCard";

export default function MassageApplyCard() {
  const massageQuery = dormitoryQueries.massage();
  const { data: massageApplicants, isLoading: isMassageLoading } =
    useQuery(massageQuery);
  const applicants = massageApplicants?.applicants ?? [];
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
    <>
      <ApplyCard
        title="안마의자"
        icon={<ChairIcon />}
        current={applicants.length}
        total={MASSAGE_CAPACITY}
        timeText="※ 안마의자 신청 시간은 20:20 ~ 21:00에 신청이 가능해요"
        buttonText={
          isMassageLoading
            ? "확인 중"
            : hasAppliedMassage
              ? "취소"
              : massageActionState.isApplyDisabled
                ? "신청 불가"
                : "신청"
        }
        buttonSize={
          !hasAppliedMassage &&
          !isMassageLoading &&
          massageActionState.isApplyDisabled
            ? "fit"
            : "small"
        }
        detailHref="/dormitory#massage"
        femaleNotice
        disabled={massageActionState.isActionDisabled}
        onApply={
          hasAppliedMassage ? handleOpenCancelConfirm : handleApplyMassage
        }
      />
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
    </>
  );
}
