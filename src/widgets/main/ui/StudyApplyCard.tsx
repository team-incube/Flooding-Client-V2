"use client";

import { useQuery } from "@tanstack/react-query";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { useApplyStudy } from "@/features/self-study/model/useApplyStudy";
import ApplyCard from "./ApplyCard";

const STUDY_MAX = 50;

export default function StudyApplyCard() {
  const studyQuery = dormitoryQueries.study();
  const { data: students = [] } = useQuery(studyQuery);
  const applyMutation = useApplyStudy();

  return (
    <ApplyCard
      title="자습신청"
      icon={<BookIcon />}
      current={students.length}
      total={STUDY_MAX}
      timeText="자습 신청 시간은 20:00 ~ 21:00에 신청이 가능해요"
      buttonText="신청"
      onApply={() => applyMutation.mutate()}
    />
  );
}
