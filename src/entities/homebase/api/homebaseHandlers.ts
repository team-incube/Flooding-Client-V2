import { http, HttpResponse } from "msw";
import type { HomebaseReservation } from "../model/homebase";

const mockHomebaseReservations: HomebaseReservation[] = [
  {
    id: 1,
    startPeriod: 8,
    endPeriod: 9,
    homebaseId: 1,
    reason: "회의",
    members: [
      { studentNumber: "2501", name: "박건우" },
      { studentNumber: "2502", name: "이수진" },
    ],
  },
  {
    id: 2,
    startPeriod: 10,
    endPeriod: 11,
    homebaseId: 4,
    reason: "스터디",
    members: [
      { studentNumber: "1301", name: "김태양" },
      { studentNumber: "1302", name: "최아름" },
      { studentNumber: "3401", name: "정민호" },
    ],
  },
];

export const homebaseHandlers = [
  http.get("*/homebase", () => HttpResponse.json(mockHomebaseReservations)),

  http.post("*/homebase/:homebaseId", () =>
    HttpResponse.json({ success: true }, { status: 201 }),
  ),

  http.delete("*/homebase/:homebaseId", () =>
    new HttpResponse(null, { status: 204 }),
  ),

  http.patch("*/homebase/:homebaseId", () =>
    new HttpResponse(null, { status: 204 }),
  ),
];
