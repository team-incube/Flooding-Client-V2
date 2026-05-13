import { instance } from "@/shared/api/instance";
import type { ClubType, ClubStatus } from "../model/club";

export const postClub = async (body: {
  name: string;
  description: string;
  type: ClubType;
  status: ClubStatus;
  imageUrl: string;
  maxMember: number;
}) => {
  const { data } = await instance.post("/clubs", body);
  return data;
};
