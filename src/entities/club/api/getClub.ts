import { instance } from '@/shared/api/instance';
import type { ClubDetailResponse } from '../model/club';

export async function getClubDetail(id: number): Promise<ClubDetailResponse> {
  const { data: body } = await instance.get<{ data: ClubDetailResponse }>(`/clubs/${id}`);
  return body.data;
}
