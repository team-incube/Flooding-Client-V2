"use client";

import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getClubs } from "./getClubs";
import { getClubDetail } from "./getClub";
import { getClubOpeningRequests } from "./getClubOpeningRequests";
import { getClubOpeningStatus } from "./getClubOpeningStatus";
import { patchClubApproval } from "./patchClubApproval";
import { postClub } from "./postClub";
import { deleteClub } from "./deleteClub";
import { putClub } from "./putClub";
import { uploadClubRepresentativeImage } from "./uploadClubRepresentativeImage";

export const clubQueries = {
  list: () =>
    queryOptions({
      queryKey: ["club", "list"],
      queryFn: () => getClubs(),
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ["club", "detail", id],
      queryFn: () => getClubDetail(id),
    }),

  openingRequests: () =>
    queryOptions({
      queryKey: ["club", "opening-requests"],
      queryFn: getClubOpeningRequests,
    }),

  openingStatus: () =>
    queryOptions({
      queryKey: ["club", "opening-status"],
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
      queryClient.invalidateQueries({ queryKey: ["club"] });
      queryClient.invalidateQueries({ queryKey: ["club", "detail", clubId] });
    },
  });
};

export const useDeleteClub = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clubId: number) => deleteClub(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club"] });
    },
  });
};

export const usePutClub = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      clubId,
      body,
    }: {
      clubId: number;
      body: {
        name: string;
        description: string;
        imageUrl?: string;
        maxMember?: number;
      };
    }) => putClub(clubId, body),
    onSuccess: (_, { clubId }) => {
      queryClient.invalidateQueries({ queryKey: ["club"] });
      queryClient.invalidateQueries({ queryKey: ["club", "detail", clubId] });
    },
  });
};

export const usePostClub = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club"] });
    },
  });
};

export const useUploadClubRepresentativeImage = () =>
  useMutation({
    mutationFn: uploadClubRepresentativeImage,
  });
