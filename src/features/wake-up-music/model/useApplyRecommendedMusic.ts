"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { dormitoryMutations } from "@/entities/dormitory/api/dormitoryQueries";

export function useApplyRecommendedMusic() {
  const queryClient = useQueryClient();

  const applyRecommendedMutation = useMutation({
    ...dormitoryMutations.applyMusic(),
    mutationKey: ["dormitory", "music-apply-recommended"],
    meta: {
      getExtras: (body: { musicUrl: string }) => ({ musicUrl: body.musicUrl }),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dormitory", "music"] });
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 기상음악을 신청했습니다.");
        return;
      }
      toast.error("기상음악 신청에 실패했습니다.");
    },
  });

  const handleSubmitRecommendedMusic = async (selectedUrl: string) => {
    await applyRecommendedMutation.mutateAsync({ musicUrl: selectedUrl });
  };

  return { handleSubmitRecommendedMusic };
}
