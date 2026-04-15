import { queryOptions } from '@tanstack/react-query';
import { instance } from '@/shared/api/instance';
import { getHomebase } from './get-homebase';
import type { HomebaseApplyRequest, HomebasePatchRequest } from '../model/types';

export const homebaseQueries = {
  list: () =>
    queryOptions({
      queryKey: ['homebase'],
      queryFn: getHomebase,
    }),
} as const;

export const homebaseMutations = {
  apply: (homebaseId: number, body: HomebaseApplyRequest) =>
    instance.post(`/homebase/${homebaseId}`, body),

  cancel: (homebaseId: number) =>
    instance.delete(`/homebase/${homebaseId}`),

  update: (homebaseId: number, body: HomebasePatchRequest) =>
    instance.patch(`/homebase/${homebaseId}`, body),
};
