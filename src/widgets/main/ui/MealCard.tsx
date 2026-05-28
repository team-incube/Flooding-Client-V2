"use client";

import { Suspense, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Bowl from "@/shared/asset/svg/Bowl";
import Back from "@/shared/asset/svg/Back";
import { neisQueries } from "@/entities/neis/api/neisQueries";
import {
  MEAL_TYPES,
  MEAL_TYPE_MAP,
  type MealType,
} from "@/entities/neis/model/neis";
import { getCurrentMealSelection } from "@/entities/neis/lib/getCurrentMealType";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { formatDateParam, formatDisplayDate } from "@/shared/lib/date";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

function MealCardLoading() {
  return (
    <div className="bg-background-surface flex h-[300px] w-full flex-col rounded-2xl p-5 sm:p-6 lg:h-[498px]">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-5 w-28" />
      </div>
      <Skeleton className="mb-4 h-[60px] w-full rounded-lg" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:flex lg:flex-col lg:gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}

function MealCardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="bg-background-surface flex h-[300px] w-full flex-col rounded-2xl p-5 sm:p-6 lg:h-[498px]">
      <div className="mb-4 flex items-center gap-1">
        <Bowl />
        <span className="text-text-1 text-main-text font-semibold">급식표</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <span className="text-text-3 text-negative font-medium">
          급식을 불러오지 못했습니다.
        </span>
        <TextButton variant="outlined" size="fit" onClick={resetErrorBoundary}>
          다시 시도
        </TextButton>
      </div>
    </div>
  );
}

function MealCardEmpty() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <span className="text-text-3 text-sub-1 font-medium">
        급식 정보가 없습니다.
      </span>
    </div>
  );
}

function MealContentLoading() {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:flex lg:flex-col lg:gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}

interface MealCardContentProps {
  dateStr: string;
  selectedTab: MealType;
}

function MealCardContent({ dateStr, selectedTab }: MealCardContentProps) {
  const { data: meals } = useSuspenseQuery(neisQueries.meals(dateStr));

  const selectedMeal = meals?.find(
    (m) => m.mealType === MEAL_TYPE_MAP[selectedTab],
  );
  const menuItems = selectedMeal?.menus ?? [];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {menuItems.length > 0 ? (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:flex lg:flex-col lg:gap-3">
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
        <MealCard.Empty />
      )}
    </div>
  );
}

const MealCard = () => {
  const [initialMealSelection] = useState(getCurrentMealSelection);
  const [offset, setOffset] = useState(initialMealSelection.dateOffset);
  const [selectedTab, setSelectedTab] = useState<MealType>(
    initialMealSelection.mealType,
  );

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);

  const debouncedOffset = useDebouncedValue(offset, 300);
  const debouncedDate = new Date();
  debouncedDate.setDate(debouncedDate.getDate() + debouncedOffset);
  const dateStr = formatDateParam(debouncedDate);

  return (
    <div className="bg-background-surface flex h-[300px] w-full flex-col rounded-2xl p-5 sm:p-6 lg:h-[498px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Bowl />
          <span className="text-text-1 text-main-text font-semibold">
            급식표
          </span>
        </div>
        <div className="text-text-3 text-sub-1 flex items-center gap-2 font-medium">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setOffset((o) => o - 1)}
          >
            <Back direction="left" />
          </button>
          <span>{formatDisplayDate(currentDate)}</span>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setOffset((o) => o + 1)}
          >
            <Back direction="right" />
          </button>
        </div>
      </div>

      <div className="bg-sub-4 mb-4 flex rounded-lg p-2">
        {MEAL_TYPES.map((type) => (
          <button
            type="button"
            key={type}
            onClick={() => setSelectedTab(type)}
            className={`text-text-4 flex-1 cursor-pointer rounded-lg py-3 font-medium ${
              selectedTab === type
                ? "bg-p-1 text-background-surface"
                : "text-sub-2"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <Suspense fallback={<MealContentLoading />}>
        <MealCardContent dateStr={dateStr} selectedTab={selectedTab} />
      </Suspense>
    </div>
  );
};

MealCard.Loading = MealCardLoading;
MealCard.Error = MealCardError;
MealCard.Empty = MealCardEmpty;

export function MealCardBoundary() {
  return (
    <ClientQueryBoundary
      loadingFallback={<MealCard.Loading />}
      errorFallback={MealCard.Error}
    >
      <MealCard />
    </ClientQueryBoundary>
  );
}

export default MealCard;
