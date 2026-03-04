"use client";

import { useState } from "react";
import Back from "@/shared/asset/svg/Back";
import Calendar from "@/shared/asset/svg/Calender";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDate(date: Date): string {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const day = DAYS[date.getDay()];
  return `${yy}.${mm}.${dd} (${day})`;
}

export default function TimeTableCard() {
  const [offset, setOffset] = useState(0);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);

  const selectedIndex = 2;

  const items = [
    {
      period: "1 교시",
      time: "08:40 ~ 09:30",
      subject: "영어",
      teachers: "천혁진",
    },
    {
      period: "2 교시",
      time: "09:40 ~ 10:30",
      subject: "빅데이터 분석 결과 시각화",
      teachers: "최은지, 노주원",
    },
    {
      period: "3 교시",
      time: "10:40 ~ 11:30",
      subject: "SQL 활용",
      teachers: "이주원",
    },
    {
      period: "4 교시",
      time: "11:40 ~ 12:30",
      subject: "음악 감상과 비평",
      teachers: "전지원",
    },
    {
      period: "5 교시",
      time: "11:40 ~ 12:30",
      subject: "음악 감상과 비평",
      teachers: "전지원",
    },
    {
      period: "6 교시",
      time: "11:40 ~ 12:30",
      subject: "음악 감상과 비평",
      teachers: "전지원",
    },
    {
      period: "7 교시",
      time: "11:40 ~ 12:30",
      subject: "음악 감상과 비평",
      teachers: "전지원",
    },
  ];

  return (
    <div className="w-full min-w-[280px] h-[334px] 2xl:h-[354px] bg-background-surface rounded-2xl p-4 2xl:p-6">
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
          <span>{formatDate(currentDate)}</span>
          <button onClick={() => setOffset((o) => o + 1)}>
            <Back direction="right" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 h-[262px] overflow-auto">
        {items.map((it, idx) => {
          const active = idx === selectedIndex;

          return (
            <div
              key={it.period}
              className={`flex items-center justify-between px-3 p-3 2xl:px-6 2xl:py-4 rounded-lg bg-sub-4 ${
                active && "border border-p-1"
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="font-medium text-sub-1 text-text-4 2xl:text-text-3">
                  {it.period}
                </span>
                <span className="text-caption-1 text-sub-2 font-medium">
                  {it.time}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sub-1 text-caption-1 2xl:text-text-4 font-medium">
                <span>{it.subject}</span>
                <span className="text-caption-2 2xl:text-caption-1 text-sub-2 font-medium">
                  {it.teachers}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
