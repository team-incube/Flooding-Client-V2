"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { clubApplicationMutations } from "@/entities/club-application/api/clubApplicationQueries";

export function useApplyAutonomousClub(clubId: number) {
  const queryClient = useQueryClient();
  const detailQuery = clubQueries.detail(clubId);
  const listQuery = clubQueries.list();

  return useMutation({
    mutationFn: () => clubApplicationMutations.applyAutonomous(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: detailQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: listQuery.queryKey });
      toast.success("자율 동아리 신청이 완료되었습니다.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 신청한 동아리입니다.");
        return;
      }

      toast.error("자율 동아리 신청에 실패했습니다.");
    },
  });
}
