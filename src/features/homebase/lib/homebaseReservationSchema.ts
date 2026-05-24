import { z } from "zod";

export const homebaseReservationDraftSchema = z.object({
  reservationDate: z.string().trim().min(1, "예약 날짜를 선택해주세요"),
  startPeriod: z.number().int().min(8).max(11),
  endPeriod: z.number().int().min(8).max(11),
  reason: z.string().trim().min(1, "신청사유를 입력해주세요"),
  selectedTable: z.string().trim().min(1, "테이블을 선택해주세요"),
});
