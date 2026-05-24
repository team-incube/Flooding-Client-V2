import {
  MEAL_TYPE_END_MINUTES,
  type MealType,
} from "@/entities/neis/model/neis";

interface CurrentMealSelection {
  mealType: MealType;
  dateOffset: number;
}

export function getCurrentMealSelection(
  now = new Date(),
): CurrentMealSelection {
  const totalMinutes = now.getHours() * 60 + now.getMinutes();

  if (totalMinutes <= MEAL_TYPE_END_MINUTES.조식) {
    return { mealType: "조식", dateOffset: 0 };
  }

  if (totalMinutes <= MEAL_TYPE_END_MINUTES.중식) {
    return { mealType: "중식", dateOffset: 0 };
  }

  if (totalMinutes <= MEAL_TYPE_END_MINUTES.석식) {
    return { mealType: "석식", dateOffset: 0 };
  }

  return { mealType: "조식", dateOffset: 1 };
}

export function getCurrentMealType(): MealType {
  return getCurrentMealSelection().mealType;
}
