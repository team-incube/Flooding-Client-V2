import { http, HttpResponse } from "msw";
import type { User } from "../model/user";

// 테스트용 mock 유저 — 인력사무소(id: 1) 부장
// 실제 인증 연동 후 제거 예정
const MOCK_ME: User = {
  id: 1,
  name: "김민솔",
  studentNumber: 3411,
  grade: 3,
  classNumber: 4,
  number: 11,
  sex: "WOMAN",
  email: "minsolkim@school.com",
  role: "GENERAL_STUDENT",
  dormitoryRoom: 301,
  dormitoryFloor: 3,
  specialty: "FE",
  penaltyScore: 0,
  isBanned: false,
};

export const userHandlers = [
  http.get("*/users/me", () => {
    return HttpResponse.json({ data: MOCK_ME });
  }),
];
