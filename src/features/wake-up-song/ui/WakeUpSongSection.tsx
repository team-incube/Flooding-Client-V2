"use client";

import { useState } from "react";
import Music from "@/shared/asset/svg/Music";
import { MusicListItem } from "@/shared/ui/MusicListItem";
import { Calendar } from "@/shared/ui/Calendar";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";

const MOCK_SONGS = [
  {
    title: "아이유 (IU) - 밤편지 (Through the Night) [Official MV]",
    studentInfo: "20501 박건우",
    time: "08:30",
  },
  {
    title:
      "06. 멋진헛간 (Wonderful Barn) – 오대천왕 (The 5 Emperor) (정형돈, 밴드 혁오) (Jeong Hyeong Don, hyukoh)",
    studentInfo: "20502 이수진",
    time: "14:14",
  },
  {
    title: "NewJeans (뉴진스) 'Hype Boy' Official MV (Performance ver.1)",
    studentInfo: "10301 김태양",
    time: "09:22",
  },
  {
    title: "BTS (방탄소년단) 'Dynamite' Official MV",
    studentInfo: "10302 최아름",
    time: "07:45",
  },
  {
    title: "IVE 아이브 'LOVE DIVE' MV",
    studentInfo: "30401 정민호",
    time: "11:03",
  },
  {
    title: "BLACKPINK - 'Pink Venom' M/V",
    studentInfo: "20201 한지원",
    time: "13:55",
  },
  {
    title: "aespa 에스파 'Girls' MV",
    studentInfo: "10101 오준혁",
    time: "08:17",
  },
  {
    title: "SEVENTEEN (세븐틴) 'Super' Official MV",
    studentInfo: "20302 윤서연",
    time: "10:40",
  },
  {
    title: "Stray Kids '소리꾼' M/V",
    studentInfo: "30201 강동현",
    time: "12:00",
  },
  {
    title: 'TWICE "FANCY" M/V',
    studentInfo: "10402 신예린",
    time: "15:30",
  },
];

export function WakeUpSongSection() {
  const [urlInput, setUrlInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <section className="bg-background-surface rounded-2xl p-6 flex flex-col gap-6">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music />
          <span className="text-main-text font-bold text-[18px]">
            기상음악 신청
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-[14px]">신청 음악</span>
          <span className="text-p-1 font-bold text-[14px]">
            {MOCK_SONGS.length}개
          </span>
        </div>
      </div>

      {/* 본문: 음악 리스트 + 우측 패널 */}
      <div className="flex gap-6">
        {/* 좌측: 음악 리스트 */}
        <div className="flex-1 min-w-0 max-h-[600px] overflow-y-auto pr-2">
          <div className="flex flex-col">
            {MOCK_SONGS.map((song, i) => (
              <MusicListItem
                key={i}
                title={song.title}
                studentInfo={song.studentInfo}
                time={song.time}
              />
            ))}
          </div>
        </div>

        {/* 우측: 신청 폼 + 달력 */}
        <div className="w-[330px] shrink-0 flex flex-col gap-4">
          <span className="text-main-text font-semibold text-[16px]">
            음악 신청
          </span>
          <TextField
            placeholder="URL을 입력해주세요"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <TextButton variant="filled" size="wide" onClick={() => {}}>
            신청하기
          </TextButton>

          {/* 구분선 */}
          <div className="h-px bg-sub-3" />

          {/* 달력 */}
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </section>
  );
}
