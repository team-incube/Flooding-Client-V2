import { z } from "zod";

export const attendanceResponseSchema = z.object({
  userId: z.number(),
  name: z.string(),
  studentNumber: z.number(),
});
