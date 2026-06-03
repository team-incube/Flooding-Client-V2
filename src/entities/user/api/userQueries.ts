import { queryOptions } from "@tanstack/react-query";
import { getMe } from "@/entities/user/api/getMe";
import { getUsers } from "@/entities/user/api/getUsers";
import type { SearchUsersParams } from "@/entities/user/model/user";

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: ["user", "me"],
      queryFn: getMe,
      staleTime: Infinity,
    }),
  list: (params: SearchUsersParams = {}) =>
    queryOptions({
      queryKey: ["user", "list", params],
      queryFn: () => getUsers(params),
    }),
} as const;
