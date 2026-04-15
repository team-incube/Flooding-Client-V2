import { instance } from '@/shared/api/instance';
import type { HomebaseReservation } from '../model/types';

export async function getHomebase(): Promise<HomebaseReservation[]> {
  const { data } = await instance.get<HomebaseReservation[]>('/homebase');
  return data;
}
