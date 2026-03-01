"use client";

import Back from "@/shared/asset/svg/Back";
import Calendar from "@/shared/asset/svg/Calender";

export default function TimeTableCard() {
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
    <div className="w-[480px] h-[354px] bg-background-surface rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Calendar />
          <span className="text-size-text-1 font-semibold text-main-text">
            시간표
          </span>
        </div>

        <div className="flex items-center gap-2 text-size-text-3 text-sub-1 font-medium">
          <button>
            <Back direction="left" />
          </button>
          <span>25.05.29 (목)</span>
          <button>
            <Back direction="right" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 h-[266px] overflow-auto">
        {items.map((it, idx) => {
          const active = idx === selectedIndex;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between px-6 py-4 rounded-lg bg-sub-4 ${
                active && "border border-p-1"
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="font-medium text-sub-1 text-size-text-3">
                  {it.period}
                </span>
                <span className="text-size-caption-1 text-sub-2 font-medium">
                  {it.time}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sub-1 text-size-text-4 font-medium">
                <span>{it.subject}</span>
                <span className="text-size-caption-1 text-sub-2 font-medium">
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
