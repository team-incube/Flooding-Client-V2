import { Sex } from "@/entities/user/model/user";

interface ClubBase {
  id: number;
  name: string;
  type: string;
  description: string;
  imageUrl?: string;
}

export interface Club extends ClubBase {
  totalMember: number;
}

export interface ClubDetailInfo extends ClubBase {
  leader: string;
  maxMember?: number;
}

export interface ClubMember {
  id: number;
  name: string;
  studentNumber: number;
  sex: Sex;
  major: string;
  role?: string;
  generation?: number;
  isLeader?: boolean;
}

export interface ProjectLink {
  type: string;
  link: string;
}

export interface ClubProject {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  participants: {
    member: ClubMember[];
  };
  links: ProjectLink[];
}

export interface ClubDetail {
  club: ClubDetailInfo;
  member: ClubMember[];
  project: ClubProject[];
}
