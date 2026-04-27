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
}
