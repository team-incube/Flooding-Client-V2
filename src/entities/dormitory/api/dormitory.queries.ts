import { queryOptions } from '@tanstack/react-query';
import { instance } from '@/shared/api/instance';
import {
  getDormitoryMusic,
  getMassageApplicants,
  getSelfStudyApplicants,
} from './get-dormitory';
import type { MusicApplyRequest } from '../model/types';

export const dormitoryQueries = {
  music: () =>
    queryOptions({
      queryKey: ['dormitory', 'music'],
      queryFn: getDormitoryMusic,
    }),

  massage: () =>
    queryOptions({
      queryKey: ['dormitory', 'massage'],
      queryFn: getMassageApplicants,
    }),

  study: () =>
    queryOptions({
      queryKey: ['dormitory', 'study'],
      queryFn: getSelfStudyApplicants,
    }),
} as const;

export const dormitoryMutations = {
  applyMusic: (body: MusicApplyRequest) =>
    instance.post('/dormitory/music', body),

  likeMusic: (musicId: number) =>
    instance.post(`/dormitory/${musicId}/like`),

  deleteMusic: (musicId: number) =>
    instance.delete(`/dormitory/${musicId}`),

  applyMassage: () => instance.post('/dormitory/massage'),

  cancelMassage: () => instance.delete('/dormitory/massage'),

  applyStudy: () => instance.post('/dormitory/study'),

  cancelStudy: () => instance.delete('/dormitory/study'),

  submitInquiry: (body: { content: string }) =>
    instance.post('/dormitory/inquiry', body),

  banStudy: (userId: number) =>
    instance.patch(`/dormitory/study/${userId}`),
};
