"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";

interface BanStudyResult {
  successfulStudentIds: number[];
  failedCount: number;
}

export function useBanStudy() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
    mutationFn: async (studentIds: number[]): Promise<BanStudyResult> => {
      const results = await Promise.allSettled(
        studentIds.map(dormitoryMutations.banStudy),
      );
      const successfulStudentIds = studentIds.filter(
        (_, index) => results[index].status === "fulfilled",
      );
      const failedResult = results.find(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected",
      );

      if (successfulStudentIds.length === 0 && failedResult) {
        throw failedResult.reason;
      }

      return {
        successfulStudentIds,
        failedCount: studentIds.length - successfulStudentIds.length,
      };
    },
    onSuccess: ({ successfulStudentIds, failedCount }) => {
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });

      if (failedCount > 0) {
        toast.warning(
          `${successfulStudentIds.length}명은 자습 금지 처리했고, ${failedCount}명은 실패했습니다.`,
        );
        return;
      }

      toast.success(
        `${successfulStudentIds.length}명을 자습 금지 처리했습니다.`,
      );
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
