"use client";

import { useQuery } from "@tanstack/react-query";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { createApplicationActionState } from "@/entities/dormitory/lib/applicationActionState";
import { useApplyStudy } from "@/features/self-study/model/useApplyStudy";
import { useCancelStudy } from "@/features/self-study/model/useCancelStudy";
import ApplyCard from "./ApplyCard";

const STUDY_MAX = 50;

export default function StudyApplyCard() {
  const studyQuery = dormitoryQueries.study();
  const { data: studyApplicants, isLoading: isStudyLoading } =
    useQuery(studyQuery);
  const students = studyApplicants?.applicants ?? [];
  const isApplicationOpen = studyApplicants?.isApplicationOpen ?? false;
  const applyMutation = useApplyStudy();
  const cancelMutation = useCancelStudy();
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
  });

  const handleApplyStudy = () => {
    if (!studyActionState.canApply) {
      return;
    }

    applyMutation.mutate();
  };

  const handleCancelStudy = () => {
    if (!studyActionState.canCancel) {
      return;
    }

    cancelMutation.mutate();
  };

  return (
    <ApplyCard
      title="자습신청"
      icon={<BookIcon />}
      current={students.length}
      total={STUDY_MAX}
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
      detailHref="/dormitory"
      disabled={studyActionState.isActionDisabled}
      onApply={hasAppliedStudy ? handleCancelStudy : handleApplyStudy}
    />
  );
}
