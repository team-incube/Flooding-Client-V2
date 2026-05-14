import { z } from "zod";

export const homebaseReservationDraftSchema = z.object({
  reservationDate: z.string().trim().min(1),
  startPeriod: z.number().int().min(8).max(11),
  endPeriod: z.number().int().min(8).max(11),
  reason: z.string().trim().min(1),
  selectedTable: z.string().trim().min(1),
});
