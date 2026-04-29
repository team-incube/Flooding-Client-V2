import { instance } from "@/shared/api/instance";
import type { ClubType, ClubStatus } from "../model/club";

export const patchClubApproval = async (
  clubId: number,
  body: { approved: boolean },
) => {
  const { data } = await instance.patch(`/clubs/${clubId}/approval`, body);
  return data;
};

export const postClub = async (body: {
  name: string;
  description: string;
  type: ClubType;
  status: ClubStatus;
  imageUrl?: string;
  maxMember?: number;
}) => {
  const { data } = await instance.post("/clubs", body);
  return data;
};

export const deleteClub = async (clubId: number) => {
  const { data } = await instance.delete(`/clubs/${clubId}`);
  return data;
};

export const putClub = async (
  clubId: number,
  body: {
    name: string;
    description: string;
    imageUrl?: string;
    maxMember?: number;
  },
) => {
  const { data } = await instance.put(`/clubs/${clubId}`, body);
  return data;
};
