"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Bowl from "@/shared/asset/svg/Bowl";
import Back from "@/shared/asset/svg/Back";
import { neisQueries } from "@/entities/neis/api/neisQueries";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MEAL_TYPES = ["조식", "중식", "석식"] as const;
type MealType = (typeof MEAL_TYPES)[number];

const MEAL_TYPE_MAP: Record<MealType, string> = {
  조식: "BREAKFAST",
  중식: "LUNCH",
  석식: "DINNER",
};

function getCurrentMealType(): MealType {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  if (totalMinutes <= 8 * 60) return "조식";
  if (totalMinutes <= 13 * 60 + 30) return "중식";
  return "석식";
}

function formatDisplayDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const day = DAYS[date.getDay()];
  return `${yy}.${mm}.${dd} (${day})`;
}

function formatParamDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function MealCard() {
  const [offset, setOffset] = useState(0);
  const [selectedTab, setSelectedTab] = useState<MealType>(getCurrentMealType);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  const dateStr = formatParamDate(currentDate);

  const { data: meals, isPending } = useQuery(neisQueries.meals(dateStr));

  const selectedMeal = meals?.find(
    (m) => m.mealType === MEAL_TYPE_MAP[selectedTab],
  );
  const menuItems = selectedMeal?.menus ?? [];

  return (
    <div className="w-full h-[300px] lg:h-[498px] bg-background-surface rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Bowl />
          <span className="text-text-1 font-semibold text-main-text">
            급식표
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-3 text-sub-1 font-medium">
          <button onClick={() => setOffset((o) => o - 1)}>
            <Back direction="left" />
          </button>
          <span>{formatDisplayDate(currentDate)}</span>
          <button onClick={() => setOffset((o) => o + 1)}>
            <Back direction="right" />
          </button>
        </div>
      </div>

      <div className="flex rounded-lg bg-sub-4 p-2 mb-4">
        {MEAL_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedTab(type)}
            className={`flex-1 py-3 rounded-lg text-text-4 font-medium ${
              selectedTab === type
                ? "bg-p-1 text-background-surface"
                : "text-sub-2"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        {isPending ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-text-3 text-sub-1 font-medium">
              급식을 불러오는 중...
            </span>
          </div>
        ) : menuItems.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 lg:flex lg:flex-col lg:gap-3">
            {menuItems.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="text-text-1 text-sub-1 font-semibold"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-text-3 text-sub-1 font-medium">
              급식 정보가 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
