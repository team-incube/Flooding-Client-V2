import { queryOptions } from "@tanstack/react-query";
import { getClubs } from "./getClubs";

export const clubQueries = {
  list: () =>
    queryOptions({
      queryKey: ["club", "list"],
      queryFn: getClubs,
    }),
} as const;
