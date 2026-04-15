import { dormitoryHandlers } from "@/entities/dormitory/api/dormitoryHandlers";
import { homebaseHandlers } from "@/entities/homebase/api/homebaseHandlers";

export const handlers = [...dormitoryHandlers, ...homebaseHandlers];
