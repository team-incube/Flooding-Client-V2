"use client";

import { useState } from "react";
import Back from "@/shared/asset/svg/Back";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

function buildCalendarGrid(viewDate: Date): Date[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: Date[] = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push(new Date(year, month - 1, prevMonthDays - i));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push(new Date(year, month + 1, nextDay++));
  }

  return cells;
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
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
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={prevMonth}
          className="rotate-90 cursor-pointer"
        >
          <Back />
        </button>
        <span className="text-main-text text-text-4">
          {formatHeader(viewDate)}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="-rotate-90 cursor-pointer"
        >
          <Back />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="flex items-center justify-center w-10 h-10 p-2 text-sub-1 text-caption-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-1.5 gap-y-3">
        {cells.map((date) => {
          const isCurrentMonth = isSameMonth(date, viewDate);
          const isSelected = selectedDate && isSameDay(selectedDate, date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => {
                if (!isCurrentMonth) setViewDate(date);
                onDateSelect?.(date);
              }}
              className={`flex items-center justify-center w-10 h-10 p-2 rounded-lg text-caption-1 outline-none cursor-pointer transition-colors
                ${
                  isSelected
                    ? "bg-p-1 text-sub-4"
                    : isCurrentMonth
                      ? "bg-background-surface text-sub-1"
                      : "bg-background-surface text-sub-2"
                }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
