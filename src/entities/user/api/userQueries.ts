import { queryOptions } from "@tanstack/react-query";
import { getMe } from "@/entities/user/api/getMe";

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: ["user", "me"],
      queryFn: getMe,
    }),
} as const;
