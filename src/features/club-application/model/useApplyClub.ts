"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { clubApplicationMutations } from "@/entities/club-application/api/clubApplicationQueries";
import type { ClubApplicationRequest } from "@/entities/club-application/model/application";

export function useApplyClub(clubId: number) {
  const queryClient = useQueryClient();
  const detailQuery = clubQueries.detail(clubId);

  return useMutation({
    mutationFn: (body: ClubApplicationRequest) =>
      clubApplicationMutations.apply(clubId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: detailQuery.queryKey });
      toast.success("동아리 신청이 완료되었습니다.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.BadRequest) {
        toast.error("필수 항목을 입력해주세요.");
        return;
      }
      if (status === HttpStatusCode.NotFound) {
        toast.error("활성화된 신청 폼이 없습니다.");
        return;
      }
      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 신청한 동아리입니다.");
        return;
      }

      toast.error("동아리 신청에 실패했습니다.");
    },
  });
}
