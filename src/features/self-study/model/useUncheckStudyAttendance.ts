"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";
import type { StudyApplicants } from "@/entities/dormitory/model/dormitory";

export function useUncheckStudyAttendance() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
    ...dormitoryMutations.uncheckStudyAttendance(),
    onMutate: async (studentId) => {
      await queryClient.cancelQueries({ queryKey: studyQuery.queryKey });
      const previous = queryClient.getQueryData<StudyApplicants>(
        studyQuery.queryKey,
      );
      queryClient.setQueryData<StudyApplicants>(studyQuery.queryKey, (prev) =>
        prev
          ? {
              ...prev,
              applicants: prev.applicants.map((a) =>
                a.userId === studentId ? { ...a, isChecked: false } : a,
              ),
            }
          : prev,
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success("출석 체크가 해제되었습니다.");
    },
    onError: (error, _studentId, context) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      // 404는 체크 기록이 없는 상태이므로 낙관적 결과(unchecked)를 유지한다.
      if (status !== HttpStatusCode.NotFound && context?.previous) {
        queryClient.setQueryData(studyQuery.queryKey, context.previous);
      }

      if (status === HttpStatusCode.NotFound) {
        toast.error("체크인 기록을 찾을 수 없습니다.");
        return;
      }

      toast.error("체크인 해제에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
    },
  });
}
