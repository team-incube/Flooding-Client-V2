"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";
import type { SearchUsersPage } from "@/entities/user/model/user";
import { userQueries } from "@/entities/user/api/userQueries";

interface UnbanStudyResult {
  successfulStudentIds: number[];
  failedCount: number;
}

export function useUnbanStudy() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
    mutationFn: async (studentIds: number[]): Promise<UnbanStudyResult> => {
      const results = await Promise.allSettled(
        studentIds.map(dormitoryMutations.unbanStudy),
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
    onMutate: async (studentIds) => {
      await queryClient.cancelQueries({
        queryKey: userQueries.list().queryKey,
      });
      const previousData = queryClient.getQueriesData<SearchUsersPage>({
        queryKey: userQueries.list().queryKey,
      });
      queryClient.setQueriesData<SearchUsersPage>(
        { queryKey: userQueries.list().queryKey },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            content: current.content.map((student) =>
              studentIds.includes(student.id)
                ? { ...student, isBanned: false }
                : student,
            ),
          };
        },
      );
      return { previousData };
    },
    onSuccess: ({ successfulStudentIds, failedCount }) => {
      if (failedCount > 0) {
        toast.warning(
          `${successfulStudentIds.length}명은 자습 금지를 해제했고, ${failedCount}명은 실패했습니다.`,
        );
        return;
      }

      toast.success(
        `${successfulStudentIds.length}명의 자습 금지를 해제했습니다.`,
      );
    },
    onError: (error, _studentIds, context) => {
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        toast.error("존재하지 않는 학생이거나 자습 금지 상태가 아닙니다.");
        return;
      }

      toast.error("자습 금지 해제에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: userQueries.list().queryKey });
    },
  });
}
