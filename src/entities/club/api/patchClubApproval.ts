import { instance } from "@/shared/api/instance";

export const patchClubApproval = async (
  clubId: number,
  body: { approved: boolean },
) => {
  const { data } = await instance.patch(`/clubs/${clubId}/approval`, body);
  return data;
};
