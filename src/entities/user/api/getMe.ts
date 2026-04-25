import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import type { User } from "@/entities/user/model/user";

type MeResponse = User | { data?: User };

async function getMe(): Promise<User | null> {
  const { data } = await instance.get<MeResponse>("/users/me");
  return "id" in data ? data : (data.data ?? null);
}

export const meQuery = queryOptions({
  queryKey: ["user", "me"],
  queryFn: getMe,
});
