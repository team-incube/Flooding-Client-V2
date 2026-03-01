"use client";

import { useState } from "react";
import Bowl from "@/shared/asset/svg/Bowl";
import Back from "@/shared/asset/svg/Back";

type MealType = "조식" | "중식" | "석식";

const MEAL_TABS: MealType[] = ["조식", "중식", "석식"];

const mockMeals: Record<MealType, string[]> = {
  조식: ["10곡잡곡밥 05", "추어탕.. 05, 06, 13", "야채계란찜 01, 02"],
  중식: [
    "10곡잡곡밥 05",
    "갑오징어미나리초무침 05, 06, 13, 17",
    "돈육불고기상추쌈/ 05, 06, 10, 13",
    "배추김치 09",
    "배추김치 09",
    "수리취떡",
  ],
  석식: ["흰쌀밥", "된장찌개 05, 06", "제육볶음 05, 10, 13", "깍두기 09"],
};

export default function MealCard() {
  const [activeTab, setActiveTab] = useState<MealType>("중식");

  return (
    <div className="w-[426px] h-[497px] bg-background-surface rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Bowl />
          <span className="text-size-text-1 font-semibold text-main-text">
            급식표
          </span>
        </div>
        <div className="flex items-center gap-2 text-size-text-3 text-sub-1">
          <button>
            <Back direction="left" />
          </button>
          <span>25.05.29 (목)</span>
          <button>
            <Back direction="right" />
          </button>
        </div>
      </div>

      <div className="flex bg-background-muted rounded-lg p-1 mb-4">
        {MEAL_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-md text-size-text-3 font-medium transition-colors ${
              activeTab === tab
                ? "bg-p-1 text-background-surface"
                : "text-sub-1"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {mockMeals[activeTab].map((item, index) => (
          <li key={index} className="text-size-text-2 text-main-text">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
