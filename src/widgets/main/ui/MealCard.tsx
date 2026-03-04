"use client";

import { useState } from "react";
import Bowl from "@/shared/asset/svg/Bowl";
import Back from "@/shared/asset/svg/Back";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const day = DAYS[date.getDay()];
  return `${yy}.${mm}.${dd} (${day})`;
}

const Meals = [
  "10곡잡곡밥 05",
  "추어탕.. 05, 06, 13",
  "야채계란찜 01, 02",
  "갑오징어미나리초무침 05, 06, 13, 17",
  "돈육불고기상추쌈/ 05, 06, 10, 13",
  "배추김치 09",
  "배추김치 09",
  "수리취떡",
];

export default function MealCard() {
  const [offset, setOffset] = useState(0);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);

  return (
    <div className="w-[426px] min-w-[280px] h-[478px] min-[1600px]:h-[497px] bg-background-surface rounded-2xl p-4 min-[1600px]:p-6 flex flex-col">
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
          <span>{formatDate(currentDate)}</span>
          <button onClick={() => setOffset((o) => o + 1)}>
            <Back direction="right" />
          </button>
        </div>
      </div>

      <div className="flex rounded-lg bg-sub-4 p-2 mb-4">
        <button className="flex-1 py-3 rounded-lg bg-p-1 text-background-surface text-text-4 font-medium">
          조식
        </button>
        <button className="flex-1 py-3 rounded-lg text-sub-2 text-text-4 font-medium">
          중식
        </button>
        <button className="flex-1 py-3 rounded-lg text-sub-2 text-text-4 font-medium">
          석식
        </button>
      </div>

      <ul className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {Meals.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="text-caption-1 min-[1600px]:text-text-1 text-sub-1 font-semibold"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
