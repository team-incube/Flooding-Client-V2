"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";

export function useCancelMassage() {
  const queryClient = useQueryClient();
  const massageQuery = dormitoryQueries.massage();

  return useMutation({
    ...dormitoryMutations.cancelMassage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: massageQuery.queryKey });
      toast.success("안마의자 신청이 취소되었습니다.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        toast.error("안마의자 신청 내역이 없습니다.");
        return;
      }

      toast.error("안마의자 취소에 실패했습니다.");
    },
  });
}
