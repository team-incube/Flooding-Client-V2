import { instance } from "@/shared/api/instance";

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
