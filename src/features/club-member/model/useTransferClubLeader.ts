"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { clubMemberMutations } from "@/entities/club-member/api/clubMemberMutations";

export function useTransferClubLeader(clubId: number) {
  const queryClient = useQueryClient();
  const detailQuery = clubQueries.detail(clubId);

  return useMutation({
    mutationFn: (targetUserId: number) =>
      clubMemberMutations.transferLeader(clubId, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: detailQuery.queryKey });
      toast.success("소유권을 위임했습니다.");
    },
    onError: () => {
      toast.error("소유권 위임에 실패했습니다.");
    },
  });
}
