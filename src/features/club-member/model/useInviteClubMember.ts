"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clubMemberMutations } from "@/entities/club-member/api/clubMemberMutations";

export function useInviteClubMember(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => clubMemberMutations.invite(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", "detail", clubId] });
      toast.success("멤버를 초대했습니다.");
    },
    onError: () => {
      toast.error("멤버 초대에 실패했습니다.");
    },
  });
}
