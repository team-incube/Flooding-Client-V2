"use client";

import { useQuery } from "@tanstack/react-query";
import ChairIcon from "@/shared/asset/svg/Chair";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { useApplyMassage } from "@/features/massage-chair/model/useApplyMassage";
import ApplyCard from "./ApplyCard";

const MASSAGE_MAX = 5;

export default function MassageApplyCard() {
  const massageQuery = dormitoryQueries.massage();
  const { data: applicants = [] } = useQuery(massageQuery);
  const applyMutation = useApplyMassage();

  return (
    <ApplyCard
      title="안마의자"
      icon={<ChairIcon />}
      current={applicants.length}
      total={MASSAGE_MAX}
      timeText="안마 의자 신청 시간은 20:20 ~ 21:00에 신청이 가능해요"
      buttonText="신청"
      femaleNotice
      onApply={() => applyMutation.mutate()}
    />
  );
}
