import { z } from "zod";

export const musicUrlSchema = z.string().min(1);
