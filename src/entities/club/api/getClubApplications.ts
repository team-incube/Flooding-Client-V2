import { instance } from "@/shared/api/instance";
import type { ClubApplicationListResponse } from "../model/club";

export async function getClubApplications(
  clubId: number,
): Promise<ClubApplicationListResponse> {
  const { data: body } = await instance.get<{
    data: ClubApplicationListResponse;
  }>(`/clubs/${clubId}/applications`);
  return body.data;
}
