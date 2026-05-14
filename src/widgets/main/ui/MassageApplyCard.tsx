"use client";

import { useQuery } from "@tanstack/react-query";
import ChairIcon from "@/shared/asset/svg/Chair";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { useApplyMassage } from "@/features/massage-chair/model/useApplyMassage";
import { useCancelMassage } from "@/features/massage-chair/model/useCancelMassage";
import { createApplicationActionState } from "@/shared/lib/applicationActionState";
import ApplyCard from "./ApplyCard";

const MASSAGE_MAX = 5;

export default function MassageApplyCard() {
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
    <ApplyCard
      title="안마의자"
      icon={<ChairIcon />}
      current={applicants.length}
      total={MASSAGE_MAX}
      timeText="안마 의자 신청 시간은 20:20 ~ 21:00에 신청이 가능해요"
      buttonText={
        isUserLoading || isMassageLoading
          ? "확인 중"
          : hasAppliedMassage
            ? "취소"
            : isApplicationOpen
              ? "신청 불가"
              : "신청"
      }
      buttonSize={!hasAppliedMassage && isApplicationOpen ? "fit" : "small"}
      detailHref="/dormitory"
      femaleNotice
      disabled={massageActionState.isActionDisabled}
      onApply={hasAppliedMassage ? handleCancelMassage : handleApplyMassage}
    />
  );
}
