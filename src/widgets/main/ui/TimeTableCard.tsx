"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Back from "@/shared/asset/svg/Back";
import Calendar from "@/shared/asset/svg/Calender";
import { neisQueries } from "@/entities/neis/api/neisQueries";
import {
  NEIS_OFFICE_CODE,
  NEIS_SCHOOL_CODE,
} from "@/entities/neis/model/neis";
import { userQueries } from "@/entities/user/api/userQueries";

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

function formatParamDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function TimeTableCard() {
  const [offset, setOffset] = useState(0);
  const activeRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  const dateStr = formatParamDate(currentDate);

  const currentPeriod = offset === 0 ? getCurrentPeriod() : null;

  const { data: user } = useQuery(userQueries.me());
  const { data: timetables, isPending } = useQuery({
    ...neisQueries.timetables({
      officeCode: NEIS_OFFICE_CODE,
      schoolCode: NEIS_SCHOOL_CODE,
      grade: user?.grade ?? 0,
      classNumber: user?.classNumber ?? 0,
      date: dateStr,
    }),
    enabled: !!user?.grade && !!user?.classNumber,
  });

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentPeriod, timetables]);

  return (
    <div className="w-full h-[140px] flex flex-col bg-background-surface rounded-2xl p-6 2xl:h-[354px] 2xl:block">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Calendar />
          <span className="text-text-1 font-semibold text-main-text">
            시간표
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

      <div className="flex flex-col gap-3 overflow-auto flex-1 h-auto 2xl:flex-none 2xl:h-[262px]">
        {isPending ? (
          <div className="flex items-center justify-center flex-1">
            <span className="text-text-3 text-sub-1 font-medium">
              시간표를 불러오는 중...
            </span>
          </div>
        ) : timetables && timetables.length > 0 ? (
          timetables.map((it) => {
            const active = it.period === currentPeriod;
            const times = PERIOD_TIMES[it.period];
            return (
              <div
                key={it.period}
                ref={active ? activeRef : undefined}
                className={`flex items-center justify-between px-6 py-4 rounded-lg bg-sub-4 ${
                  active ? "border border-p-1" : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sub-1 text-text-3">
                    {it.period} 교시
                  </span>
                  {times && (
                    <span className="text-caption-1 text-sub-2 font-medium">
                      {times[0]} ~ {times[1]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sub-1 text-text-4 font-medium">
                  <span>{it.subject}</span>
                  <span className="text-caption-1 text-sub-2 font-medium">
                    {it.teacher}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center flex-1">
            <span className="text-text-3 text-sub-1 font-medium">
              시간표 정보가 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
