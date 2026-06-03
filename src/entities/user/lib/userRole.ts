import type { User, UserRole } from "@/entities/user/model/user";

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

const DORMITORY_TEACHER_NAME = "사감선생님";

export function getGreetingName(user?: Pick<User, "name">): string {
  if (!user) {
    return "";
  }

  // 사감선생님 계정은 이름 데이터가 "사감선생님" 자체로 내려오므로
  // 성 떼기나 "님" 추가 없이 그대로 표시한다.
  if (user.name === DORMITORY_TEACHER_NAME) {
    return user.name;
  }

  return `${user.name.slice(1)}님`;
}
