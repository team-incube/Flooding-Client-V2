export type UserRole =
  | "GENERAL_STUDENT"
  | "STUDENT_COUNCIL"
  | "DORMITORY_MANAGER"
  | "ADMIN";

export type Sex = "MAN" | "WOMAN";

export interface User {
  id: number;
  name: string;
  sex: Sex;
  email: string;
  studentNumber: number;
  grade: number;
  classNumber: number;
  number: number;
  role: UserRole;
  dormitoryRoom: number;
  dormitoryFloor: number;
  specialty: string;
  penaltyScore: number;
  isBanned: boolean;
  hasClubApplication: boolean;
}

export interface SearchUser {
  id: number;
  name: string;
  sex: Sex;
  studentNumber: number;
  grade: number;
  classNumber: number;
  number: number;
  isBanned: boolean;
  role?: UserRole;
}

export interface SearchUsersPage {
  content: SearchUser[];
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SearchUsersParams {
  name?: string;
  studentNumber?: string;
  page?: number;
  size?: number;
  sort?: string;
}
