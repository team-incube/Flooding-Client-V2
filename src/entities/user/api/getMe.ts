import { instance } from "@/shared/api/instance";
import type { User } from "@/entities/user/model/user";

export async function getMe(): Promise<User> {
  const { data } = await instance.get<{ data: User }>("/users/me");
  return data.data;
}
