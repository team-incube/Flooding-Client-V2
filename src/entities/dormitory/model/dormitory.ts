import type { User } from '@/entities/user/model/user';
import type { Music } from '@/entities/music/model/music';

export type DormitoryStudent = User;
export type DormitoryMusic = Music;

export interface MusicApplyRequest {
  url: string;
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