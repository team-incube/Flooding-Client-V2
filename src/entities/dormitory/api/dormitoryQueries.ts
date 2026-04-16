import { queryOptions } from '@tanstack/react-query';
import { instance } from '@/shared/api/instance';
import {
  getDormitoryMusic,
  getMassageApplicants,
  getSelfStudyApplicants,
  getMyPenalties,
  getAllPenalties,
  getCleaningZones,
  getCleaningZoneDetail,
} from './getDormitory';
import type { 
  MusicApplyRequest, 
  UpdatePenaltyRequest, 
  CreateCleaningZoneRequest 
} from '../model/dormitory';

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

  myPenalties: () =>
    queryOptions({
      queryKey: ['dormitory', 'penalties', 'me'],
      queryFn: getMyPenalties,
    }),

  allPenalties: () =>
    queryOptions({
      queryKey: ['dormitory', 'penalties'],
      queryFn: getAllPenalties,
    }),

  cleaningZones: () =>
    queryOptions({
      queryKey: ['dormitory', 'cleaning-zones'],
      queryFn: getCleaningZones,
    }),

  cleaningZoneDetail: (zoneId: number) =>
    queryOptions({
      queryKey: ['dormitory', 'cleaning-zones', zoneId],
      queryFn: () => getCleaningZoneDetail(zoneId),
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

  updatePenalties: (userId: number, body: UpdatePenaltyRequest) => 
    instance.put(`/dormitory/penalties/${userId}`, body),

  createCleaningZone: (body: CreateCleaningZoneRequest) => 
    instance.post('/dormitory/cleaning-zones', body),
};
