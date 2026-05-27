import { z } from "zod";

export const musicUrlSchema = z.string().trim().min(1);
