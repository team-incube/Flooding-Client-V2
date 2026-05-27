"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryQueries,
  dormitoryMutations,
} from "@/entities/dormitory/api/dormitoryQueries";

export function useApplyMassage() {
  const queryClient = useQueryClient();
  const massageQuery = dormitoryQueries.massage();

  return useMutation({
    ...dormitoryMutations.applyMassage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: massageQuery.queryKey });
      toast.success("안마의자 신청이 완료되었습니다.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.BadRequest) {
        toast.error("안마의자 신청 시간이 아닙니다.");
        return;
      }
      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 안마의자를 신청했습니다.");
        return;
      }

      toast.error("안마의자 신청에 실패했습니다.");
    },
  });
}
