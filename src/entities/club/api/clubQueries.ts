"use client";

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { instance } from '@/shared/api/instance';
import { getClubs } from './getClubs';
import { getClubDetail } from './getClub';
import { getClubForm } from './getClubForm';
import { getClubApplications } from './getClubApplications';
import type {
  ClubApplicationRequest,
  CreateClubFormRequest,
} from '../model/club';
import { deleteClub, patchClubApproval, postClub, putClub } from "./club";

export const clubQueries = {
  list: () =>
    queryOptions({
      queryKey: ['club', 'list'],
      queryFn: () => getClubs(),
      staleTime: Infinity,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ['club', 'detail', id],
      queryFn: () => getClubDetail(id),
      staleTime: Infinity,
    }),

  form: (clubId: number) =>
    queryOptions({
      queryKey: ['club', 'form', clubId],
      queryFn: () => getClubForm(clubId),
    }),

  applicationList: (clubId: number) =>
    queryOptions({
      queryKey: ['club', 'applications', clubId],
      queryFn: () => getClubApplications(clubId),
    }),
} as const;

export const clubMutations = {
  createForm: (clubId: number, body: CreateClubFormRequest) =>
    instance.post(`/clubs/${clubId}/forms`, body),

  updateForm: (clubId: number, body: CreateClubFormRequest) =>
    instance.put(`/clubs/${clubId}/forms`, body),

  applyClub: (clubId: number, body: ClubApplicationRequest) =>
    instance.post(`/clubs/${clubId}/applications`, body),

  applyAutonomousClub: (clubId: number) =>
    instance.post(`/clubs/${clubId}/autonomous/applications`),

  approveApplication: (clubId: number, userId: number) =>
    instance.patch(`/clubs/${clubId}/applications/${userId}`),
} as const;

export const usePatchClubApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clubId, body }: { clubId: number; body: { approved: boolean } }) =>
      patchClubApproval(clubId, body),
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