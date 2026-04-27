import { dormitoryHandlers } from "@/entities/dormitory/api/dormitoryHandlers";
import { clubHandlers } from "@/entities/club/api/clubHandlers";

export const handlers = [...dormitoryHandlers, ...clubHandlers];
