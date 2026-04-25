"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryQueries,
  dormitoryMutations,
} from "@/entities/dormitory/api/dormitoryQueries";

export function useApplyStudy() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
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
}
