"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clubQueries } from "@/entities/club/api/clubQueries";
import {
  clubApplicationMutations,
  clubApplicationQueries,
} from "@/entities/club-application/api/clubApplicationQueries";

interface ApproveClubApplicationVariables {
  userId: number;
}

export function useApproveClubApplication(clubId: number) {
  const queryClient = useQueryClient();
  const applicationListQuery = clubApplicationQueries.list(clubId);
  const detailQuery = clubQueries.detail(clubId);
  const listQuery = clubQueries.list();

  return useMutation({
    mutationFn: ({ userId }: ApproveClubApplicationVariables) =>
      clubApplicationMutations.approve(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationListQuery.queryKey,
      });
      queryClient.invalidateQueries({ queryKey: detailQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: listQuery.queryKey });
      toast.success("동아리 신청을 승인했습니다.");
    },
    onError: () => {
      toast.error("동아리 신청 승인에 실패했습니다.");
    },
  });
}
