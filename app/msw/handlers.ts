import { dormitoryHandlers } from "@/entities/dormitory/api/dormitoryHandlers";
import { homebaseHandlers } from "@/entities/homebase/api/homebaseHandlers";
import { clubHandlers } from "@/entities/club/api/clubHandlers";

export const handlers = [...dormitoryHandlers, ...homebaseHandlers, ...clubHandlers];
