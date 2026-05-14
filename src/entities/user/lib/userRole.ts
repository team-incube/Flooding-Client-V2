import type { UserRole } from "@/entities/user/model/user";

const roleLabels: Partial<Record<UserRole, string>> = {
  ADMIN: "관리자",
  DORMITORY_MANAGER: "기자위",
  STUDENT_COUNCIL: "학생회",
};

export function getRoleLabel(role?: UserRole): string | null {
  if (!role) {
    return null;
  }

  return roleLabels[role] ?? null;
}
