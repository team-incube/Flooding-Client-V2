export type UserRole =
  | "GENERAL_STUDENT"
  | "STUDENT_COUNCIL"
  | "DORMITORY_MANAGER";

export type Sex = "MAN" | "WOMAN";

export interface User {
  id: number;
  name: string;
  sex: Sex;
  email: string;
  studentNumber: number;
  role: UserRole;
  dormitoryRoom: number;
}
