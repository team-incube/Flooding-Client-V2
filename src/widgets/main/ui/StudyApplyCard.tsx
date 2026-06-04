"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { createApplicationActionState } from "@/entities/dormitory/lib/applicationActionState";
import { STUDY_CAPACITY } from "@/entities/dormitory/model/constants";
import { useApplyStudy } from "@/features/self-study/model/useApplyStudy";
import { useCancelStudy } from "@/features/self-study/model/useCancelStudy";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import ApplyCard from "./ApplyCard";

export default function StudyApplyCard() {
  const studyQuery = dormitoryQueries.study();
  const { data: studyApplicants, isLoading: isStudyLoading } =
    useQuery(studyQuery);
  const students = studyApplicants?.applicants ?? [];
  const isApplicationOpen = studyApplicants?.isApplicationOpen ?? false;
  const applyMutation = useApplyStudy();
  const cancelMutation = useCancelStudy();
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const isStudyBanned = studyApplicants?.myApplicationStatus === "BANNED";
  const hasAppliedStudy = studyApplicants?.myApplicationStatus === "APPROVED";
  const isStudyCancelled = studyApplicants?.myApplicationStatus === "CANCELLED";
  const studyActionState = createApplicationActionState({
    hasApplied: hasAppliedStudy,
    isUserLoading: false,
    isDataLoading: isStudyLoading,
    isBanned: isStudyBanned,
    isCancelled: isStudyCancelled,
    isActionPending: applyMutation.isPending || cancelMutation.isPending,
    isApplicationOpen,
    isFull: students.length >= STUDY_CAPACITY,
  });

  const handleApplyStudy = () => {
    if (!studyActionState.canApply) {
      return;
    }

    applyMutation.mutate();
  };

  const handleOpenCancelConfirm = () => {
    if (!studyActionState.canCancel) {
      return;
    }

    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancelStudy = () => {
    if (!studyActionState.canCancel) {
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
        title="자습신청"
        icon={<BookIcon />}
        current={students.length}
        total={STUDY_CAPACITY}
        timeText="※ 자습 신청 시간은 20:00 ~ 21:00에 신청이 가능해요"
        buttonText={
          isStudyBanned
            ? "자습 금지를 당했어요!"
            : isStudyLoading
              ? "확인 중"
              : hasAppliedStudy
                ? "취소"
                : studyActionState.isApplyDisabled
                  ? "신청 불가"
                  : "신청"
        }
        buttonVariant={isStudyBanned ? "negative" : "filled"}
        buttonSize={
          isStudyBanned ||
          (!hasAppliedStudy &&
            !isStudyLoading &&
            studyActionState.isApplyDisabled)
            ? "fit"
            : "small"
        }
        detailHref="/dormitory#self-study"
        disabled={studyActionState.isActionDisabled}
        onApply={hasAppliedStudy ? handleOpenCancelConfirm : handleApplyStudy}
      />
      <ConfirmModal
        open={isCancelConfirmOpen}
        title="자습 신청 취소"
        titleVariant="negative"
        description="정말 자습 신청을 취소하시겠어요?"
        confirmLabel="취소하기"
        confirmVariant="negative"
        isPending={cancelMutation.isPending}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleConfirmCancelStudy}
      />
    </>
  );
}
