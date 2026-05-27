import { Sex } from "@/entities/user/model/user";

export type ClubType = "MAJOR_CLUB" | "AUTONOMOUS_CLUB";
export type ClubStatus = "MAINTAIN" | "NEW";
export type RegistrationType = "NEW" | "MAINTAIN" | null;

export interface Club {
  id: number;
  name: string;
  type: ClubType;
  leader?: string;
  description: string;
  imageUrl?: string;
  totalMember: number;
}

export interface ClubListResponse {
  club: Club[];
}

export interface ClubDetail {
  isClosed?: boolean;
  id: number;
  name: string;
  type: ClubType;
  leader?: string;
  leaderId?: number;
  description: string;
  imageUrl?: string;
  maxMember?: number;
}

export interface ClubMember {
  id: number;
  name: string;
  studentNumber: number;
  sex: Sex;
  specialty: string;
}

export interface ProjectParticipant {
  id: number;
  name?: string;
  studentNumber?: number;
  sex: Sex;
  specialty: string;
}

export interface ProjectLink {
  type: string;
  link: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  participants: ProjectParticipant[];
  links?: ProjectLink[];
}

export interface ClubDetailResponse {
  club: ClubDetail;
  members: ClubMember[];
  projects: Project[];
  isLeader: boolean;
}

export interface ClubOpeningStatus {
  isOpened: boolean;
  startDate: string | null;
  endDate: string | null;
}

export interface RegistrationData {
  name: string;
  status: ClubStatus;
  type: ClubType;
  description: string;
  imageUrl: string;
  maxMember: number;
}

export interface UploadClubRepresentativeImageResponse {
  imageUrl: string;
}
