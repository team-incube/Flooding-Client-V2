import axios, { HttpStatusCode } from "axios";
import { instance } from "@/shared/api/instance";
import type { ClubForm } from "../model/club";

export async function getClubForm(clubId: number): Promise<ClubForm | null> {
  try {
    const { data: body } = await instance.get<{ data: ClubForm }>(
      `/clubs/${clubId}/forms`,
    );
    return body.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === HttpStatusCode.NotFound
    ) {
      return null;
    }

    throw error;
  }
}
