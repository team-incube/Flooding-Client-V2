import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { getClubApplications } from "./getClubApplications";
import type { ClubApplicationRequest } from "../model/application";

export const clubApplicationQueries = {
  list: (clubId: number) =>
    queryOptions({
      queryKey: ["club-application", "list", clubId],
      queryFn: () => getClubApplications(clubId),
    }),
} as const;

export const clubApplicationMutations = {
  apply: (clubId: number, body: ClubApplicationRequest) =>
    instance.post(`/clubs/${clubId}/applications`, body),

  applyAutonomous: (clubId: number) =>
    instance.post(`/clubs/${clubId}/autonomous/applications`),

  approve: (clubId: number, userId: number) =>
    instance.patch(`/clubs/${clubId}/applications/${userId}`),
} as const;
