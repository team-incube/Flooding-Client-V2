import { instance } from '@/shared/api/instance';
import type { Club, ClubDetailResponse } from '../model/club';

export async function getClubs(): Promise<Club[]> {
  const { data } = await instance.get<{ club: Club[] }>('/club');
  return data.club;
}

export async function getClubDetail(id: number): Promise<ClubDetailResponse> {
  const { data } = await instance.get<ClubDetailResponse>(`/club/${id}`);
  return data;
}
