import type { UserRole } from "@/entities/user/model/user";

interface CreateStudyPermissionParams {
  role?: UserRole;
}

export function createStudyPermission({ role }: CreateStudyPermissionParams) {
  const isManager = role === "ADMIN" || role === "DORMITORY_MANAGER";

  return {
    isManager,
    canManage: isManager,
    canCheckAttendance: isManager,
  };
}
