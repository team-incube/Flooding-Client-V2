import { instance } from "@/shared/api/instance";
import type { Club } from "../model/club";

async function getClubsByType(
  type: "MAJOR_CLUB" | "AUTONOMOUS_CLUB",
): Promise<Club[]> {
  const { data: body } = await instance.get("/clubs", { params: { type } });
  return body.data?.clubs ?? [];
}

export async function getClubs(): Promise<{ clubs: Club[] }> {
  const [major, autonomous] = await Promise.all([
    getClubsByType("MAJOR_CLUB"),
    getClubsByType("AUTONOMOUS_CLUB"),
  ]);
  return { clubs: [...major, ...autonomous] };
}
