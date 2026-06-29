import type { UserRole } from "@/entities/user/model/user";

interface CreateMusicPermissionParams {
  role?: UserRole;
}

export function createMusicPermission({ role }: CreateMusicPermissionParams) {
  return {
    canDeleteAnyMusic: role === "ADMIN" || role === "DORMITORY_MANAGER",
    canUseAiAnalysis: role === "ADMIN" || role === "DORMITORY_MANAGER",
  };
}
