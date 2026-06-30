import type { UserRole } from "@/entities/user/model/user";

// 기자위(DORMITORY_MANAGER) 중 AI 분석을 쓸 수 있는 사감 계정 이름
const DORM_SUPERVISOR_NAME = "사감선생님";

interface CreateMusicPermissionParams {
  role?: UserRole;
  name?: string;
}

export function createMusicPermission({
  role,
  name,
}: CreateMusicPermissionParams) {
  const isDormManager = role === "DORMITORY_MANAGER";

  return {
    canDeleteAnyMusic: role === "ADMIN" || isDormManager,
    // 어드민은 모두 가능, 기자위는 사감선생님만 가능
    canUseAiAnalysis:
      role === "ADMIN" || (isDormManager && name === DORM_SUPERVISOR_NAME),
  };
}
