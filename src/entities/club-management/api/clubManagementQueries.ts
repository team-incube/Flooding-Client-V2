"use client";

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getClubOpeningRequests } from "@/entities/club/api/getClubOpeningRequests";
import { getClubOpeningStatus } from "@/entities/club/api/getClubOpeningStatus";
import { patchClubApproval } from "@/entities/club/api/patchClubApproval";
import type { Club, ClubApprovalStatus } from "@/entities/club/model/club";

export const clubManagementQueries = {
  openingRequests: () =>
    queryOptions({
      queryKey: ["club-management", "opening-requests"],
      queryFn: getClubOpeningRequests,
      staleTime: Infinity,
    }),

  openingStatus: () =>
    queryOptions({
      queryKey: ["club-management", "opening-status"],
      queryFn: getClubOpeningStatus,
    }),
} as const;

export const usePatchClubApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      clubId,
      body,
    }: {
      clubId: number;
      body: { approved: boolean };
    }) => patchClubApproval(clubId, body),
    onSuccess: (_, { clubId, body }) => {
      const newStatus: ClubApprovalStatus = body.approved ? "APPROVED" : "REJECTED";

      queryClient.setQueryData(
        clubManagementQueries.openingRequests().queryKey,
        (old: { clubs: Club[] } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            clubs: old.clubs.map((club) =>
              club.id === clubId ? { ...club, approvalStatus: newStatus } : club,
            ),
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["club", "list"] });
      queryClient.invalidateQueries({ queryKey: ["club", "detail", clubId] });
    },
  });
};
