"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";
import type { StudyApplicants } from "@/entities/dormitory/model/dormitory";

export function useCheckStudyAttendance() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
    ...dormitoryMutations.checkStudyAttendance(),
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
                a.userId === studentId ? { ...a, isChecked: true } : a,
              ),
            }
          : prev,
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success("출석 체크되었습니다.");
    },
    onError: (error, _studentId, context) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      // 409는 이미 체크된 상태이므로 낙관적 결과(checked)를 유지한다.
      if (status !== HttpStatusCode.Conflict && context?.previous) {
        queryClient.setQueryData(studyQuery.queryKey, context.previous);
      }

      if (status === HttpStatusCode.NotFound) {
        toast.error("자습 신청 내역을 찾을 수 없습니다.");
        return;
      }

      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 출석 체크된 학생입니다.");
        return;
      }

      toast.error("출석 체크에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
    },
  });
}
