import { Sex } from "@/entities/user/model/user";

export interface Club {
  id: number;
  name: string;
  type: string;
  leader: string;
  description: string;
  imageUrl?: string;
  totalMember: number;
}

export interface ClubListResponse {
  club: Club[];
}

export interface ClubDetail {
  id: number;
  name: string;
  type: string;
  leader: string;
  description: string;
  imageUrl?: string;
  maxMember?: number;
}

export interface ClubMember {
  id: number;
  name: string;
  studentNumber: number;
  sex: Sex;
  major: string;
}

export interface ProjectParticipant {
  id: number;
  studentNumber: number;
  sex: Sex;
  major: string;
}

export interface ProjectLink {
  type: string;
  link: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  participants: ProjectParticipant[];
  links: ProjectLink[];
}

export interface ClubDetailResponse {
  club: ClubDetail;
  member: ClubMember[];
  project: Project[];
}
