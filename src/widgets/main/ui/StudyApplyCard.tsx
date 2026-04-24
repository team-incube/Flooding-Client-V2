"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import ApplyCard from "./ApplyCard";
import {
  dormitoryQueries,
  dormitoryMutations,
} from "@/entities/dormitory/api/dormitoryQueries";

const STUDY_MAX = 50;

export default function StudyApplyCard() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();
  const { data: students = [] } = useQuery(studyQuery);

  const applyMutation = useMutation({
    mutationFn: dormitoryMutations.applyStudy,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey }),
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.BadRequest) {
        toast.error("자습 신청 시간이 아닙니다.");
        return;
      }
      if (status === HttpStatusCode.Forbidden) {
        toast.error("자습 금지 상태입니다.");
        return;
      }
      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 자습을 신청했습니다.");
        return;
      }

      toast.error("자습 신청에 실패했습니다.");
    },
  });

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
