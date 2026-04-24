"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import ChairIcon from "@/shared/asset/svg/Chair";
import ApplyCard from "./ApplyCard";
import {
  dormitoryQueries,
  dormitoryMutations,
} from "@/entities/dormitory/api/dormitoryQueries";

const MASSAGE_MAX = 5;

export default function MassageApplyCard() {
  const queryClient = useQueryClient();
  const massageQuery = dormitoryQueries.massage();
  const { data: applicants = [] } = useQuery(massageQuery);

  const applyMutation = useMutation({
    mutationFn: dormitoryMutations.applyMassage,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: massageQuery.queryKey }),
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.BadRequest) {
        toast.error("마사지 신청 시간이 아닙니다.");
        return;
      }
      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 안마의자를 신청했습니다.");
        return;
      }

      toast.error("안마의자 신청에 실패했습니다.");
    },
  });

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
