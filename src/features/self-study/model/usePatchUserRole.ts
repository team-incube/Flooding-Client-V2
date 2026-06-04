"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import {
  patchUserRole,
  type PatchUserRoleParams,
} from "@/entities/user/api/patchUserRole";
import { getRoleLabel } from "@/entities/user/lib/userRole";
import type { SearchUsersPage } from "@/entities/user/model/user";

export function usePatchUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PatchUserRoleParams) => patchUserRole(params),
    onMutate: async ({ userId, role }: PatchUserRoleParams) => {
      await queryClient.cancelQueries({ queryKey: ["user", "list"] });
      const previousData = queryClient.getQueriesData<SearchUsersPage>({
        queryKey: ["user", "list"],
      });
      queryClient.setQueriesData<SearchUsersPage>(
        { queryKey: ["user", "list"] },
        (current) => {
          if (!current) return current;
          return {
            ...current,
            content: current.content.map((student) =>
              student.id === userId ? { ...student, role } : student,
            ),
          };
        },
      );
      return { previousData };
    },
    onSuccess: (_data, { role }) => {
      const roleLabel = getRoleLabel(role) ?? "일반 학생";
      toast.success(`권한을 ${roleLabel}(으)로 변경했습니다.`);
    },
    onError: (error, _params, context) => {
      context?.previousData.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        toast.error("존재하지 않는 학생입니다.");
        return;
      }

      if (status === HttpStatusCode.Forbidden) {
        toast.error("권한을 변경할 수 있는 계정이 아닙니다.");
        return;
      }

      toast.error("권한 변경에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
  });
}
