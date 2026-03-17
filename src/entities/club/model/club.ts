import { Sex } from "@/entities/user/model/user";

export interface Club {
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
  role: string;
  generation: number;
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
  club: Club;
  member: ClubMember[];
  project: ClubProject[];
}
