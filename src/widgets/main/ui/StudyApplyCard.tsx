"use client";

import { useQuery } from "@tanstack/react-query";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { useApplyStudy } from "@/features/self-study/model/useApplyStudy";
import ApplyCard from "./ApplyCard";

const STUDY_MAX = 50;

export default function StudyApplyCard() {
  const studyQuery = dormitoryQueries.study();
  const { data: students = [] } = useQuery(studyQuery);
  const { data: user, isLoading: isUserLoading } = useQuery(userQueries.me());
  const applyMutation = useApplyStudy();
  const isStudyBanned = user?.isBanned === true;
  const isApplyDisabled =
    isUserLoading || isStudyBanned || applyMutation.isPending;

  const handleApplyStudy = () => {
    if (isApplyDisabled) {
      return;
    }

    applyMutation.mutate();
  };

  return (
    <ApplyCard
      title="자습신청"
      icon={<BookIcon />}
      current={students.length}
      total={STUDY_MAX}
      timeText="자습 신청 시간은 20:00 ~ 21:00에 신청이 가능해요"
      buttonText={
        isStudyBanned ? "자습 금지를 당했어요!" : isUserLoading ? "확인 중" : "신청"
      }
      buttonVariant={isStudyBanned ? "negative" : "filled"}
      buttonSize={isStudyBanned ? "fit" : "small"}
      disabled={isApplyDisabled}
      onApply={handleApplyStudy}
    />
  );
}
