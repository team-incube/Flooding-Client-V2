import {
  MEAL_TYPE_BOUNDARY_MINUTES,
  type MealType,
} from "@/entities/neis/model/neis";

export function getCurrentMealType(): MealType {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  if (totalMinutes <= MEAL_TYPE_BOUNDARY_MINUTES.조식) return "조식";
  if (totalMinutes <= MEAL_TYPE_BOUNDARY_MINUTES.중식) return "중식";
  return "석식";
}
