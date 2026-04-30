import { instance } from "@/shared/api/instance";

export const deleteClub = async (clubId: number) => {
  const { data } = await instance.delete(`/clubs/${clubId}`);
  return data;
};
