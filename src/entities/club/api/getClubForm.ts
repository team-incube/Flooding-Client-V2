import { instance } from "@/shared/api/instance";
import type { ClubForm } from "../model/club";

export async function getClubForm(clubId: number): Promise<ClubForm> {
  const { data: body } = await instance.get<{ data: ClubForm }>(
    `/clubs/${clubId}/forms`,
  );
  return body.data;
}
