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
