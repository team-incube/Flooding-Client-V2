import type { UserRole } from "@/entities/user/model/user";

type ClubPermissionType = "MAJOR_CLUB" | "AUTONOMOUS_CLUB";

interface CreateStudyPermissionParams {
  role?: UserRole;
}

interface CreateClubPermissionParams {
  role?: UserRole;
  clubType?: ClubPermissionType;
  isLeader?: boolean;
  isOpeningApplicationOpen?: boolean;
}

interface CreateHomebasePermissionParams {
  role?: UserRole;
}

function isStudyManagerRole(role?: UserRole) {
  return (
    role === "ADMIN" ||
    role === "DORMITORY_MANAGER" ||
    role === "STUDENT_COUNCIL"
  );
}

export function createStudyPermission({ role }: CreateStudyPermissionParams) {
  const isManager = isStudyManagerRole(role);

  return {
    isManager,
    canManage: isManager,
    canCheckAttendance: isManager,
  };
}

export function createClubPermission({
  role,
  clubType,
  isLeader = false,
  isOpeningApplicationOpen = false,
}: CreateClubPermissionParams) {
  const isAdmin = role === "ADMIN";
  const isStudentCouncil = role === "STUDENT_COUNCIL";
  const isClubManager = isAdmin || isStudentCouncil;
  const isMajorClub = clubType === "MAJOR_CLUB";

  return {
    isManager: isClubManager,
    isAdmin,
    canCheckOpeningStatus: isStudyManagerRole(role),
    canRegisterClub: isOpeningApplicationOpen && isStudyManagerRole(role),
    canViewOpeningRequests: isClubManager,
    canExport: isAdmin,
    canApprove: isLeader || isAdmin,
    canDelete: isOpeningApplicationOpen && (isLeader || isAdmin),
    canCreateForm: isMajorClub && isLeader,
    canEditForm: isMajorClub && isLeader,
    canViewApplications: isMajorClub && (isLeader || isClubManager),
    canTransferLeader: isLeader,
    canEditClub: isLeader,
  };
}

export function createHomebasePermission({
  role,
}: CreateHomebasePermissionParams) {
  return {
    canReserve: role !== undefined,
  };
}
