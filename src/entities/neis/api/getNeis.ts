import { instance } from "@/shared/api/instance";
import type {
  MealItem,
  Period,
  TimetableParams,
} from "@/entities/neis/model/neis";

interface MealsResponse {
  data: {
    date: string;
    meals: MealItem[];
  };
}

interface TimetableResponse {
  data: {
    date: string;
    grade: number;
    classNumber: number;
    periods: Period[];
  };
}

const apiKey = process.env.NEXT_PUBLIC_NEIS_API_KEY;

export async function getTimetables(
  params: TimetableParams,
): Promise<Period[]> {
  const { data } = await instance.get<TimetableResponse>(
    "/v2/neis/timetables",
    {
      params,
    },
  );
  return data.data.periods;
}

export async function getMeals(date: string): Promise<MealItem[]> {
  const { data } = await instance.get<MealsResponse>(`/v2/neis/meals`, {
    headers: {
      "X-API-KEY": apiKey,
    },
    params: {
      date,
    },
  });
  return data.data.meals;
}
