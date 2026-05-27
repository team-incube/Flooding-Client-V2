"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  clubFormMutations,
  clubFormQueries,
} from "@/entities/club-form/api/clubFormQueries";
import type { CreateClubFormRequest } from "@/entities/club-form/model/form";

export function useCreateClubForm(clubId: number) {
  const queryClient = useQueryClient();
  const formQuery = clubFormQueries.detail(clubId);

  return useMutation({
    mutationFn: (body: CreateClubFormRequest) =>
      clubFormMutations.create(clubId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formQuery.queryKey });
      toast.success("동아리 신청 폼이 생성되었습니다.");
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        toast.error(
          "동아리를 찾을 수 없습니다. 실제 서버에 존재하는 동아리인지 확인해주세요.",
        );
        return;
      }

      toast.error("동아리 신청 폼 생성에 실패했습니다.");
    },
  });
}
