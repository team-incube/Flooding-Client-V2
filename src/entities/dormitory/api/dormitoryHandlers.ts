import { http, HttpResponse } from "msw";
import {
  MOCK_MY_PENALTY,
  MOCK_ALL_PENALTIES,
  MOCK_CLEANING_ZONES,
  MOCK_CLEANING_ZONE_DETAIL,
} from "@/entities/dormitory/model/mock";

export const dormitoryHandlers = [
  // GET — 목록 조회
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
