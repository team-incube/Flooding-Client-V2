"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  clubFormMutations,
  clubFormQueries,
} from "@/entities/club-form/api/clubFormQueries";
import type { CreateClubFormRequest } from "@/entities/club-form/model/form";

export function useUpdateClubForm(clubId: number) {
  const queryClient = useQueryClient();
  const formQuery = clubFormQueries.detail(clubId);

  return useMutation({
    mutationFn: (body: CreateClubFormRequest) =>
      clubFormMutations.update(clubId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formQuery.queryKey });
      toast.success("동아리 신청 폼이 수정되었습니다.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.Forbidden) {
        toast.error("동아리 리더만 신청 폼을 수정할 수 있습니다.");
        return;
      }
      if (status === HttpStatusCode.NotFound) {
        toast.error("수정할 동아리 신청 폼이 없습니다.");
        return;
      }
      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 신청자가 있어 신청 폼을 수정할 수 없습니다.");
        return;
      }

      toast.error("동아리 신청 폼 수정에 실패했습니다.");
    },
  });
}
