"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Back from "@/shared/asset/svg/Back";
import Calendar from "@/shared/asset/svg/Calender";
import { getTimetables } from "@/entities/neis/api/getNeis";
import { neisQueries } from "@/entities/neis/api/neisQueries";
import {
  NEIS_OFFICE_CODE,
  NEIS_SCHOOL_CODE,
  PERIOD_TIMES,
} from "@/entities/neis/model/neis";
import { getCurrentPeriod } from "@/entities/neis/lib/getCurrentPeriod";
import { userQueries } from "@/entities/user/api/userQueries";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { formatDateParam, formatDisplayDate } from "@/shared/lib/date";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";

function TimeTableCardLoading() {
  return (
    <div className="bg-background-surface flex h-[354px] w-full flex-col rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="flex h-[262px] flex-col gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[58px] w-full shrink-0 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}

function TimeTableCardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="bg-background-surface flex h-[354px] w-full flex-col overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="mb-2 flex items-center gap-1">
        <Calendar />
        <span className="text-text-1 text-main-text font-semibold">시간표</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
        <span className="text-text-3 text-negative font-medium">
          시간표를 불러오지 못했습니다.
        </span>
        <TextButton variant="outlined" size="fit" onClick={resetErrorBoundary}>
          다시 시도
        </TextButton>
      </div>
    </div>
  );
}

function TimeTableCardEmpty() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <span className="text-text-3 text-sub-1 font-medium">
        시간표 정보가 없습니다.
      </span>
    </div>
  );
}

function TimeTableContentLoading() {
  return (
    <div className="flex h-[262px] flex-col gap-3 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[58px] w-full shrink-0 rounded-lg" />
      ))}
    </div>
  );
}

interface TimeTableCardContentProps {
  canFetchTimetable: boolean;
  timetableParams: {
    officeCode: string;
    schoolCode: string;
    grade: number;
    classNumber: number;
    date: string;
  };
  currentPeriod: number | null;
}

function TimeTableCardContent({
  canFetchTimetable,
  timetableParams,
  currentPeriod,
}: TimeTableCardContentProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  const timetableQuery = neisQueries.timetables(timetableParams);
  const { data: timetables } = useSuspenseQuery({
    ...timetableQuery,
    queryKey: canFetchTimetable
      ? timetableQuery.queryKey
      : ["neis", "timetables", "empty", timetableParams.date],
    queryFn: () =>
      canFetchTimetable ? getTimetables(timetableParams) : Promise.resolve([]),
  });

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentPeriod, timetables]);

  return (
    <div className="flex h-[262px] flex-col gap-3 overflow-auto">
      {!canFetchTimetable ? (
        <TimeTableCard.Empty />
      ) : timetables.length > 0 ? (
        timetables.map((it) => {
          const active = it.period === currentPeriod;
          const times = PERIOD_TIMES[it.period];
          return (
            <div
              key={it.period}
              ref={active ? activeRef : undefined}
              className={`bg-sub-4 flex items-center gap-3 rounded-lg px-6 py-4 ${
                active ? "border-p-1 border" : ""
              }`}
            >
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-sub-1 text-text-3 font-medium">
                  {it.period} 교시
                </span>
                {times && (
                  <span className="text-caption-1 text-sub-2 font-medium">
                    {times[0]} ~ {times[1]}
                  </span>
                )}
              </div>
              <div className="text-sub-1 text-text-4 flex min-w-0 flex-1 items-center gap-1 font-medium">
                <span className="min-w-0 flex-1 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] whitespace-nowrap [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {it.subject}
                </span>
                <span className="text-caption-1 text-sub-2 max-w-24 shrink-0 truncate font-medium">
                  {it.teacher}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <TimeTableCard.Empty />
      )}
    </div>
  );
}

const TimeTableCard = () => {
  const [offset, setOffset] = useState(0);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);

  const debouncedOffset = useDebouncedValue(offset, 300);
  const debouncedDate = new Date();
  debouncedDate.setDate(debouncedDate.getDate() + debouncedOffset);
  const dateStr = formatDateParam(debouncedDate);

  const currentPeriod = debouncedOffset === 0 ? getCurrentPeriod() : null;

  const { data: user } = useSuspenseQuery(userQueries.me());
  const canFetchTimetable = !!user.grade && !!user.classNumber;
  const timetableParams = {
    officeCode: NEIS_OFFICE_CODE,
    schoolCode: NEIS_SCHOOL_CODE,
    grade: user.grade ?? 0,
    classNumber: user.classNumber ?? 0,
    date: dateStr,
  };

  return (
    <div className="bg-background-surface flex h-[354px] w-full flex-col rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Calendar />
          <span className="text-text-1 text-main-text font-semibold">
            시간표
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

      <Suspense fallback={<TimeTableContentLoading />}>
        <TimeTableCardContent
          canFetchTimetable={canFetchTimetable}
          timetableParams={timetableParams}
          currentPeriod={currentPeriod}
        />
      </Suspense>
    </div>
  );
};

TimeTableCard.Loading = TimeTableCardLoading;
TimeTableCard.Error = TimeTableCardError;
TimeTableCard.Empty = TimeTableCardEmpty;

export function TimeTableCardBoundary() {
  return (
    <ClientQueryBoundary
      loadingFallback={<TimeTableCard.Loading />}
      errorFallback={TimeTableCard.Error}
    >
      <TimeTableCard />
    </ClientQueryBoundary>
  );
}

export default TimeTableCard;
