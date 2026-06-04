"use client";

import { useState } from "react";
import Back from "@/shared/asset/svg/Back";
import { todayKst } from "@/shared/lib/kst";

interface CalendarProps {
  selectedDate?: Temporal.PlainDate;
  onDateSelect?: (date: Temporal.PlainDate) => void;
}

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

function buildCalendarGrid(viewDate: Temporal.PlainDate): Temporal.PlainDate[] {
  const firstOfMonth = viewDate.with({ day: 1 });
  // dayOfWeek: 1(월)~7(일) → 월요일 시작 그리드 오프셋
  const offset = firstOfMonth.dayOfWeek - 1;
  const start = firstOfMonth.subtract({ days: offset });

  const totalCells = Math.ceil((offset + viewDate.daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) =>
    start.add({ days: index }),
  );
}

function isSameMonth(a: Temporal.PlainDate, b: Temporal.PlainDate): boolean {
  return a.year === b.year && a.month === b.month;
}

function formatHeader(viewDate: Temporal.PlainDate): string {
  const yy = String(viewDate.year).slice(2);
  return `${yy}년 ${viewDate.month}월`;
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [viewDate, setViewDate] = useState(selectedDate ?? todayKst());

  const cells = buildCalendarGrid(viewDate);

  const prevMonth = () =>
    setViewDate((d) => d.subtract({ months: 1 }).with({ day: 1 }));
  const nextMonth = () =>
    setViewDate((d) => d.add({ months: 1 }).with({ day: 1 }));

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={prevMonth}
          className="rotate-90 cursor-pointer"
        >
          <Back />
        </button>
        <button
          type="button"
          onClick={() => {
            const today = todayKst();
            setViewDate(today);
            onDateSelect?.(today);
          }}
          className="text-main-text text-text-4 cursor-pointer"
        >
          {formatHeader(viewDate)}
        </button>
        <button
          type="button"
          onClick={nextMonth}
          className="-rotate-90 cursor-pointer"
        >
          <Back />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-sub-1 text-caption-2 flex size-10 items-center justify-center p-2 sm:size-7 sm:p-1.5 lg:size-10"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-1.5 gap-y-3 sm:gap-x-1">
        {cells.map((date) => {
          const isCurrentMonth = isSameMonth(date, viewDate);
          const isSelected = selectedDate && selectedDate.equals(date);

          return (
            <button
              key={date.toString()}
              type="button"
              onClick={() => {
                if (!isCurrentMonth) setViewDate(date);
                onDateSelect?.(date);
              }}
              className={`text-caption-1 flex size-10 cursor-pointer items-center justify-center rounded-lg p-2 outline-none sm:w-7 lg:w-10 ${
                isSelected
                  ? "bg-p-1 text-sub-4"
                  : isCurrentMonth
                    ? "bg-background-surface text-sub-1"
                    : "bg-background-surface text-sub-2"
              }`}
            >
              {date.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
