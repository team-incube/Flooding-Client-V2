import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { getClubForm } from "./getClubForm";
import type { CreateClubFormRequest } from "../model/form";

export const clubFormQueries = {
  detail: (clubId: number) =>
    queryOptions({
      queryKey: ["club-form", "detail", clubId],
      queryFn: () => getClubForm(clubId),
    }),
} as const;

export const clubFormMutations = {
  create: (clubId: number, body: CreateClubFormRequest) =>
    instance.post(`/clubs/${clubId}/forms`, body),

  update: (clubId: number, body: CreateClubFormRequest) =>
    instance.put(`/clubs/${clubId}/forms`, body),
} as const;
