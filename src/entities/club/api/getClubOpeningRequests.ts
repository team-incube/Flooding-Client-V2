import { instance } from "@/shared/api/instance";
import type { Club } from "../model/club";

export const getClubOpeningRequests = async (): Promise<{ clubs: Club[] }> => {
  const { data } = await instance.get("/clubs/opening/requests");
  const result = data.data as { clubs: Club[] };
  return {
    clubs: result.clubs.map((club) => ({
      ...club,
      approvalStatus: club.approvalStatus ?? "PENDING",
    })),
  };
};
