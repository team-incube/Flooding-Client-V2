import type { Sex } from "@/entities/user/model/user";
import type { Music } from "@/entities/music/model/music";

export type DormitoryMusic = Music;

export interface DormitoryStudent {
  order: number;
  name: string;
  studentNumber: number;
  sex: Sex;
}

export interface StudyApplicant {
  userId: number;
  name: string;
  studentNumber: number;
  sex: Sex;
  isBanned: boolean;
  isChecked: boolean;
}

export type MassageApplicationStatus = "APPLIED" | "CANCELLED";

export type StudyApplicationStatus = "APPROVED" | "CANCELLED" | "BANNED";

export interface ApplicationStatus<TApplicant, TApplicationStatus> {
  isApplicationOpen: boolean;
  myApplicationStatus: TApplicationStatus | null;
  applicants: TApplicant[];
}

export type MassageApplicants = ApplicationStatus<
  DormitoryStudent,
  MassageApplicationStatus
>;
export type StudyApplicants = ApplicationStatus<
  StudyApplicant,
  StudyApplicationStatus
>;

export interface AttendanceResponse {
  userId: number;
  name: string;
  studentNumber: number;
}

export type AttendanceStreamStatus = "connecting" | "open" | "error";

export interface MusicApplyRequest {
  musicUrl: string;
}

export interface UpdatePenaltyRequest {
  score: number;
  reason: string;
}

export interface CreateCleaningZoneRequest {
  name: string;
  description: string;
}

export interface MyPenaltyResponse {
  penaltyScore: number;
}

export interface PenaltyMember {
  userId: number;
  name: string;
  studentNumber: number;
  penaltyScore: number;
}

export interface AllPenaltiesResponse {
  content: PenaltyMember[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface CleaningZones {
  id: number;
  name: string;
  description: string;
  memberCount: number;
}

export interface CleaningZoneMember {
  userId: number;
  name: string;
  studentNumber: number;
}

export interface CleaningZoneDetail {
  id: number;
  name: string;
  description: string;
  members: CleaningZoneMember[];
}
