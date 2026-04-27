import { queryOptions } from '@tanstack/react-query';
import { instance } from '@/shared/api/instance';
import { getClubs } from './getClubs';
import { getClubDetail } from './getClub';
import { getClubForm } from './getClubForm';
import { getClubApplications } from './getClubApplications';
import type {
  ClubApplicationRequest,
  CreateClubFormRequest,
} from '../model/club';

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
} as const;
