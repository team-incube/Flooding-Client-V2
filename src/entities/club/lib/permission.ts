import type { ClubType } from "@/entities/club/model/club";
import type { UserRole } from "@/entities/user/model/user";

interface CreateClubPermissionParams {
  role?: UserRole;
  clubType?: ClubType;
  isLeader?: boolean;
  isOpeningApplicationOpen?: boolean;
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
  const canManageStudy =
    role === "ADMIN" ||
    role === "DORMITORY_MANAGER" ||
    role === "STUDENT_COUNCIL";
  const isMajorClub = clubType === "MAJOR_CLUB";

  return {
    isManager: isClubManager,
    isAdmin,
    canCheckOpeningStatus: canManageStudy,
    canRegisterClub: isOpeningApplicationOpen && canManageStudy,
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
