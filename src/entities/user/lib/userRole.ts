import type { UserRole } from "@/entities/user/model/user";

const managementRoles: UserRole[] = [
  "ADMIN",
  "DORMITORY_MANAGER",
  "STUDENT_COUNCIL",
];

const roleLabels: Partial<Record<UserRole, string>> = {
  ADMIN: "관리자",
  DORMITORY_MANAGER: "기자위",
  STUDENT_COUNCIL: "학생회",
};

export function isManagementRole(role?: UserRole): boolean {
  return !!role && managementRoles.includes(role);
}

export function getRoleLabel(role?: UserRole): string | null {
  if (!role) {
    return null;
  }

  return roleLabels[role] ?? null;
}
