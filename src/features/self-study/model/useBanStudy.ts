"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";

export function useBanStudy() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
    mutationFn: async (studentIds: number[]) => {
      await Promise.all(studentIds.map(dormitoryMutations.banStudy));
      return studentIds;
    },
    onSuccess: (studentIds) => {
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
      toast.success(`${studentIds.length}명을 자습 금지 처리했어요.`);
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        toast.error("존재하지 않는 학생이 포함되어 있습니다.");
        return;
      }

      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 자습 금지 상태인 학생이 포함되어 있습니다.");
        return;
      }

      toast.error("자습 금지 처리에 실패했습니다.");
    },
  });
}
