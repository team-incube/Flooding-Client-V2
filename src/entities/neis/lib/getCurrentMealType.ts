import type { MealType } from "@/entities/neis/model/neis";

export function getCurrentMealType(): MealType {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  if (totalMinutes <= 8 * 60) return "조식";
  if (totalMinutes <= 13 * 60 + 30) return "중식";
  return "석식";
}
