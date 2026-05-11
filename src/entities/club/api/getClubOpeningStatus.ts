import { instance } from "@/shared/api/instance";
import type { ClubOpeningStatus } from "../model/club";

export async function getClubOpeningStatus(): Promise<ClubOpeningStatus> {
  const { data: body } = await instance.get("/clubs/opening-status");
  return body.data;
}
