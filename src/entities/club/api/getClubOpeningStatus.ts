import { instance } from "@/shared/api/instance";

export async function getClubOpeningStatus(): Promise<boolean> {
  const { data: body } = await instance.get("/clubs/opening-status");
  return Boolean(body.data?.isOpened);
}
