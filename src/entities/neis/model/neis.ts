export const NEIS_OFFICE_CODE = "F10";
export const NEIS_SCHOOL_CODE = "7380292";

export interface MealItem {
  mealType: string;
  menus: string[];
  calories: string;
}

export interface Period {
  period: number;
  subject: string;
  teacher: string;
  classroom: number;
}

export interface TimetableParams {
  officeCode: string;
  schoolCode: string;
  grade: number;
  classNumber: number;
  date: string;
}

export const PERIOD_TIMES: Record<number, [string, string]> = {
  1: ["08:40", "09:30"],
  2: ["09:40", "10:30"],
  3: ["10:40", "11:30"],
  4: ["11:40", "12:30"],
  5: ["13:20", "14:10"],
  6: ["14:20", "15:10"],
  7: ["15:20", "16:10"],
};

export const MEAL_TYPES = ["조식", "중식", "석식"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_TYPE_END_MINUTES: Record<MealType, number> = {
  조식: 8 * 60,
  중식: 13 * 60 + 30,
  석식: 19 * 60,
};

export const MEAL_TYPE_MAP: Record<MealType, string> = {
  조식: "BREAKFAST",
  중식: "LUNCH",
  석식: "DINNER",
};
