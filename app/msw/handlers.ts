import { dormitoryHandlers } from "@/entities/dormitory/api/dormitoryHandlers";
import { clubHandlers } from "@/entities/club/api/clubHandlers";
import { userHandlers } from "@/entities/user/api/userHandlers";

export const handlers = [...dormitoryHandlers, ...clubHandlers, ...userHandlers];
