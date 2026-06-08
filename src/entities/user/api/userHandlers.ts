import { http, HttpResponse } from "msw";
import type { User, SearchUser, SearchUsersPage } from "../model/user";
import { MOCK_STUDENTS } from "../model/mock";

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
  hasClubApplication: false,
};

export const userHandlers = [
  http.get("*/users/me", () => {
    return HttpResponse.json({ data: MOCK_ME });
  }),
  http.get("*/users", ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const studentNumber = url.searchParams.get("studentNumber");
    const page = parseInt(url.searchParams.get("page") ?? "0", 10);
    const size = parseInt(url.searchParams.get("size") ?? "500", 10);

    const filtered: SearchUser[] = MOCK_STUDENTS.filter((s) => {
      if (name && !s.name.includes(name)) return false;
      if (studentNumber && !String(s.studentNumber).includes(studentNumber))
        return false;
      return true;
    }).map(
      ({
        id,
        name: sName,
        sex,
        studentNumber: sNum,
        grade,
        classNumber,
        number,
        isBanned,
        role,
      }) => ({
        id,
        name: sName,
        sex,
        studentNumber: sNum,
        grade,
        classNumber,
        number,
        isBanned,
        role,
      }),
    );

    const start = page * size;
    const content = filtered.slice(start, start + size);

    const result: SearchUsersPage = {
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      numberOfElements: content.length,
      size,
      number: page,
      first: page === 0,
      last: start + size >= filtered.length,
      empty: content.length === 0,
    };

    return HttpResponse.json({ data: result });
  }),
];
