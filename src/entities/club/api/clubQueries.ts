import { queryOptions } from '@tanstack/react-query';
import { instance } from '@/shared/api/instance';
import { getClubs } from './getClubs';
import { getClubDetail } from './getClub';
import { getClubForm } from './getClubForm';
import type { ClubApplicationRequest, CreateClubFormRequest } from '../model/club';

export const clubQueries = {
  list: () =>
    queryOptions({
      queryKey: ['club', 'list'],
      queryFn: getClubs,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ['club', 'detail', id],
      queryFn: () => getClubDetail(id),
    }),

  form: (clubId: number) =>
    queryOptions({
      queryKey: ['club', 'form', clubId],
      queryFn: () => getClubForm(clubId),
    }),
} as const;

export const clubMutations = {
  createForm: (clubId: number, body: CreateClubFormRequest) =>
    instance.post(`/clubs/${clubId}/forms`, body),

  applyClub: (clubId: number, body: ClubApplicationRequest) =>
    instance.post(`/clubs/${clubId}/applications`, body),

  applyAutonomousClub: (clubId: number) =>
    instance.post(`/clubs/${clubId}/autonomous/applications`),
} as const;
