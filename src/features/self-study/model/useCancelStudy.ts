"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";

export function useCancelStudy() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
    ...dormitoryMutations.cancelStudy(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
      toast.success("자습 신청이 취소되었습니다.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        toast.error("자습 신청 내역이 없습니다.");
        return;
      }

      toast.error("자습 취소에 실패했습니다.");
    },
  });
}
