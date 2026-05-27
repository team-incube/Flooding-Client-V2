import { instance } from "@/shared/api/instance";

export const clubMemberMutations = {
  invite: (clubId: number, userId: number) =>
    instance.post(`/clubs/${clubId}/member/${userId}`),

  exile: (clubId: number, userId: number) =>
    instance.delete(`/clubs/${clubId}/member/exile/${userId}`),

  transferLeader: (clubId: number, targetUserId: number) =>
    instance.patch(`/clubs/${clubId}/transfer/${targetUserId}`),
} as const;
