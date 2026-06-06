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

// 관리자(ADMIN)는 실수 방지를 위해 UI에서 부여 대상에서 제외한다.
export const ASSIGNABLE_ROLES: { value: UserRole; label: string }[] = [
  { value: "GENERAL_STUDENT", label: "일반 학생" },
  { value: "STUDENT_COUNCIL", label: "학생회" },
  { value: "DORMITORY_MANAGER", label: "기자위" },
];
