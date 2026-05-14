"use client";

import { useQuery } from "@tanstack/react-query";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { useApplyStudy } from "@/features/self-study/model/useApplyStudy";
import { useCancelStudy } from "@/features/self-study/model/useCancelStudy";
import { createApplicationActionState } from "@/shared/lib/applicationActionState";
import ApplyCard from "./ApplyCard";

const STUDY_MAX = 50;

export default function StudyApplyCard() {
  const studyQuery = dormitoryQueries.study();
  const { data: studyApplicants, isLoading: isStudyLoading } =
    useQuery(studyQuery);
  const students = studyApplicants?.applicants ?? [];
  const isApplicationOpen = studyApplicants?.isApplicationOpen ?? false;
  const { data: user, isLoading: isUserLoading } = useQuery(userQueries.me());
  const applyMutation = useApplyStudy();
  const cancelMutation = useCancelStudy();
  const isStudyBanned = user?.isBanned === true;
  const hasAppliedStudy =
    user !== undefined &&
    students.some((student) => student.userId === user.id);
  const studyActionState = createApplicationActionState({
    hasApplied: hasAppliedStudy,
    isUserLoading,
    isDataLoading: isStudyLoading,
    isBanned: isStudyBanned,
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
      timeText="자습 신청 시간은 20:00 ~ 21:00에 신청이 가능해요"
      buttonText={
        isStudyBanned
          ? "자습 금지를 당했어요!"
          : isUserLoading || isStudyLoading
            ? "확인 중"
            : hasAppliedStudy
              ? "취소"
              : isApplicationOpen
                ? "신청 불가"
                : "신청"
      }
      buttonVariant={isStudyBanned ? "negative" : "filled"}
      buttonSize={
        isStudyBanned || (!hasAppliedStudy && isApplicationOpen)
          ? "fit"
          : "small"
      }
      detailHref="/dormitory"
      disabled={studyActionState.isActionDisabled}
      onApply={hasAppliedStudy ? handleCancelStudy : handleApplyStudy}
    />
  );
}
