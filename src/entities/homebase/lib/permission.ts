import type { UserRole } from "@/entities/user/model/user";

interface CreateHomebasePermissionParams {
  role?: UserRole;
}

export function createHomebasePermission({
  role,
}: CreateHomebasePermissionParams) {
  return {
    canReserve: role !== undefined,
  };
}
