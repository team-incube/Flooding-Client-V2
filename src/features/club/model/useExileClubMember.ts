"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clubMutations } from "@/entities/club/api/clubQueries";

export function useExileClubMember(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => clubMutations.exileMember(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", "detail", clubId] });
      toast.success("멤버를 추방했습니다.");
    },
    onError: () => {
      toast.error("멤버 추방에 실패했습니다.");
    },
  });
}
