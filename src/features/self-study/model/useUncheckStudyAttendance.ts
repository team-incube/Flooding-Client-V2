"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  dormitoryMutations,
  dormitoryQueries,
} from "@/entities/dormitory/api/dormitoryQueries";

interface UseUncheckStudyAttendanceParams {
  onUnchecked?: (studentId: number) => void;
}

export function useUncheckStudyAttendance({
  onUnchecked,
}: UseUncheckStudyAttendanceParams = {}) {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();

  return useMutation({
    mutationFn: dormitoryMutations.uncheckStudyAttendance,
    onSuccess: (_data, studentId) => {
      onUnchecked?.(studentId);
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
      toast.success("출석 체크가 해제되었습니다.");
    },
    onError: (error, studentId) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        onUnchecked?.(studentId);
        queryClient.invalidateQueries({ queryKey: studyQuery.queryKey });
        toast.error("체크인 기록을 찾을 수 없습니다.");
        return;
      }

      toast.error("체크인 해제에 실패했습니다.");
    },
  });
}
