import { instance } from "@/shared/api/instance";
import type { UserRole } from "@/entities/user/model/user";

export interface PatchUserRoleParams {
  userId: number;
  role: UserRole;
}

export async function patchUserRole({
  userId,
  role,
}: PatchUserRoleParams): Promise<void> {
  await instance.patch(`/users/${userId}/role`, { role });
}
