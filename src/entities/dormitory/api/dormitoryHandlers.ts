import { http, HttpResponse } from "msw";
import {
  MOCK_MASSAGE_APPLICANTS,
  MOCK_STUDY_APPLICANTS,
  MOCK_MY_PENALTY,
  MOCK_ALL_PENALTIES,
  MOCK_CLEANING_ZONES,
  MOCK_CLEANING_ZONE_DETAIL,
} from "@/entities/dormitory/model/mock";
import { MOCK_SONGS } from "@/entities/music/model/mock";

export const dormitoryHandlers = [
  // GET — 목록 조회
  http.get("*/dormitory/music", ({ request }) => {
    const sort = new URL(request.url).searchParams.get("sort");
    const songs = [...MOCK_SONGS].sort((a, b) =>
      sort === "LIKE"
        ? b.likeCount - a.likeCount
        : new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    );

    return HttpResponse.json({
      status: "OK",
      code: 200,
      message: "기상음악 목록 조회 성공",
      data: songs,
    });
  }),
  http.get("*/dormitory/massages", () =>
    HttpResponse.json({
      status: "OK",
      code: 200,
      message: "안마의자 신청자 목록 조회 성공",
      data: MOCK_MASSAGE_APPLICANTS,
    }),
  ),
  http.get("*/dormitory/studies", () =>
    HttpResponse.json({
      status: "OK",
      code: 200,
      message: "자습 신청자 목록 조회 성공",
      data: MOCK_STUDY_APPLICANTS,
    }),
  ),
  http.get("*/dormitory/penalties/me", () =>
    HttpResponse.json(MOCK_MY_PENALTY),
  ),
  http.get("*/dormitory/penalties", () =>
    HttpResponse.json(MOCK_ALL_PENALTIES),
  ),
  http.get("*/dormitory/cleaning-zones", () =>
    HttpResponse.json(MOCK_CLEANING_ZONES),
  ),
  http.get("*/dormitory/cleaning-zones/:zoneId", () =>
    HttpResponse.json(MOCK_CLEANING_ZONE_DETAIL),
  ),

  // POST — 신청
  http.post("*/dormitory/music/:musicId/like", () =>
    HttpResponse.json({ success: true }, { status: 201 }),
  ),
  http.delete("*/dormitory/music/:musicId/like", () =>
    HttpResponse.json({ success: true }),
  ),
  http.delete("*/dormitory/music/:musicId", () =>
    HttpResponse.json({ success: true }),
  ),
  http.post("*/dormitory/music", () =>
    HttpResponse.json({ success: true }, { status: 201 }),
  ),
  http.post("*/dormitory/inquiry", () =>
    HttpResponse.json({ success: true }, { status: 201 }),
  ),
  http.post("*/dormitory/cleaning-zones", () =>
    HttpResponse.json({ success: true }, { status: 201 }),
  ),

  // PUT — 벌점 설정
  http.put(
    "*/dormitory/penalties/:userId",
    () => new HttpResponse(null, { status: 204 }),
  ),
];
