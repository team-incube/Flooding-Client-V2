"use client";

import { useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Back from "@/shared/asset/svg/Back";
import Calendar from "@/shared/asset/svg/Calender";
import { getTimetables } from "@/entities/neis/api/getNeis";
import { neisQueries } from "@/entities/neis/api/neisQueries";
import { NEIS_OFFICE_CODE, NEIS_SCHOOL_CODE } from "@/entities/neis/model/neis";
import { userQueries } from "@/entities/user/api/userQueries";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  ClientQueryBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import { formatDateParam } from "@/shared/lib/date";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const PERIOD_TIMES: Record<number, [string, string]> = {
  1: ["08:40", "09:30"],
  2: ["09:40", "10:30"],
  3: ["10:40", "11:30"],
  4: ["11:40", "12:30"],
  5: ["13:20", "14:10"],
  6: ["14:20", "15:10"],
  7: ["15:20", "16:10"],
};

function getCurrentPeriod(): number | null {
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  for (const [period, [start, end]] of Object.entries(PERIOD_TIMES)) {
    if (hhmm >= start && hhmm <= end) return Number(period);
  }
  return null;
}

function formatDisplayDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const day = DAYS[date.getDay()];
  return `${yy}.${mm}.${dd} (${day})`;
}

function TimeTableCardLoading() {
  return (
    <div className="bg-background-surface flex h-[140px] w-full flex-col rounded-2xl p-6 2xl:block 2xl:h-[354px]">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-hidden 2xl:h-[262px]">
        <Skeleton className="h-[58px] w-full shrink-0 rounded-lg" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="hidden h-[58px] w-full shrink-0 rounded-lg 2xl:block"
          />
        ))}
      </div>
    </div>
  );
}

function TimeTableCardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="bg-background-surface flex h-[140px] w-full flex-col overflow-hidden rounded-2xl p-6 2xl:h-[354px]">
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

const TimeTableCard = () => {
  const [offset, setOffset] = useState(0);
  const activeRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  const dateStr = formatDateParam(currentDate);

  const currentPeriod = offset === 0 ? getCurrentPeriod() : null;

  const { data: user } = useSuspenseQuery(userQueries.me());
  const canFetchTimetable = !!user.grade && !!user.classNumber;
  const timetableParams = {
    officeCode: NEIS_OFFICE_CODE,
    schoolCode: NEIS_SCHOOL_CODE,
    grade: user.grade ?? 0,
    classNumber: user.classNumber ?? 0,
    date: dateStr,
  };
  const timetableQuery = neisQueries.timetables(timetableParams);
  const { data: timetables } = useSuspenseQuery({
    ...timetableQuery,
    queryKey: canFetchTimetable
      ? timetableQuery.queryKey
      : ["neis", "timetables", "empty", dateStr],
    queryFn: () =>
      canFetchTimetable ? getTimetables(timetableParams) : Promise.resolve([]),
  });

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentPeriod, timetables]);

  return (
    <div className="bg-background-surface flex h-[140px] w-full flex-col rounded-2xl p-6 2xl:block 2xl:h-[354px]">
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

      <div className="flex h-auto flex-1 flex-col gap-3 overflow-auto 2xl:h-[262px] 2xl:flex-none">
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
                className={`bg-sub-4 flex items-center justify-between rounded-lg px-6 py-4 ${
                  active ? "border-p-1 border" : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sub-1 text-text-3 font-medium">
                    {it.period} 교시
                  </span>
                  {times && (
                    <span className="text-caption-1 text-sub-2 font-medium">
                      {times[0]} ~ {times[1]}
                    </span>
                  )}
                </div>
                <div className="text-sub-1 text-text-4 flex items-center gap-1 font-medium">
                  <span>{it.subject}</span>
                  <span className="text-caption-1 text-sub-2 font-medium">
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
