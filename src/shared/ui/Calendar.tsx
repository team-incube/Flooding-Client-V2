"use client";

import { useState } from "react";
import Back from "@/shared/asset/svg/Back";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

function buildCalendarGrid(viewDate: Date): (number | null)[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const offset = firstDay === 0 ? 6 : firstDay - 1; // convert to Mon-start
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function formatHeader(viewDate: Date): string {
  const yy = String(viewDate.getFullYear()).slice(2);
  const mm = String(viewDate.getMonth() + 1).padStart(2, "0");
  const dd = String(viewDate.getDate()).padStart(2, "0");
  const day = DAY_KO[viewDate.getDay()];
  return `${yy}.${mm}.${dd} (${day})`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());

  const cells = buildCalendarGrid(viewDate);

  const prevMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="flex flex-col gap-3">
      {/* Navigation row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="-rotate-90 cursor-pointer"
        >
          <Back />
        </button>
        <span className="text-main-text font-medium text-[15px]">
          {formatHeader(viewDate)}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="rotate-90 cursor-pointer"
        >
          <Back />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="flex items-center justify-center h-8 text-sub-1 text-[13px] font-medium"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) =>
          day === null ? (
            <div key={i} className="h-[34px]" />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() =>
                onDateSelect?.(
                  new Date(viewDate.getFullYear(), viewDate.getMonth(), day),
                )
              }
              className={`flex items-center justify-center h-[34px] w-full rounded-lg font-medium text-[15px] outline-none cursor-pointer transition-colors
                ${
                  selectedDate &&
                  isSameDay(
                    selectedDate,
                    new Date(viewDate.getFullYear(), viewDate.getMonth(), day),
                  )
                    ? "bg-p-1 text-background-surface"
                    : "bg-background-surface text-sub-1 border border-sub-2"
                }`}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
