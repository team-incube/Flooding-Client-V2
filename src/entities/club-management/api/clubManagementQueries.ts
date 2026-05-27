"use client";

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getClubOpeningRequests } from "@/entities/club/api/getClubOpeningRequests";
import { getClubOpeningStatus } from "@/entities/club/api/getClubOpeningStatus";
import { patchClubApproval } from "@/entities/club/api/patchClubApproval";

export const clubManagementQueries = {
  openingRequests: () =>
    queryOptions({
      queryKey: ["club-management", "opening-requests"],
      queryFn: getClubOpeningRequests,
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
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: ["club", "list"] });
      queryClient.invalidateQueries({
        queryKey: clubManagementQueries.openingRequests().queryKey,
      });
      queryClient.invalidateQueries({ queryKey: ["club", "detail", clubId] });
    },
  });
};
