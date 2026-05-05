import { instance } from "@/shared/api/instance";
import type { Club } from "../model/club";

export const getClubOpeningRequests = async (): Promise<{ clubs: Club[] }> => {
  const { data } = await instance.get("/clubs/opening/requests");
  return data.data;
};
