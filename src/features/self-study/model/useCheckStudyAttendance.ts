"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";

interface UseCheckStudyAttendanceParams {
  onChecked?: (studentId: number) => void;
}

export function useCheckStudyAttendance({
  onChecked,
}: UseCheckStudyAttendanceParams = {}) {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
    mutationFn: dormitoryMutations.checkStudyAttendance,
    onSuccess: (_data, studentId) => {
      onChecked?.(studentId);
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
    },
    onError: (error, studentId) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        toast.error("자습 신청 내역을 찾을 수 없습니다.");
        return;
      }

      if (status === HttpStatusCode.Conflict) {
        onChecked?.(studentId);
        toast.error("이미 출석 체크된 학생입니다.");
        return;
      }

      toast.error("출석 체크에 실패했습니다.");
    },
  });
}
