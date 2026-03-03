"use client";

import { useState } from "react";
import Music from "@/shared/asset/svg/Music";
import { MusicListItem } from "@/shared/ui/MusicListItem";
import { Calendar } from "@/shared/ui/Calendar";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";
import { MOCK_SONGS } from "@/entities/music/model/mock";

export function WakeUpMusicSection() {
  const [urlInput, setUrlInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <section className="bg-background-surface rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex items-end gap-3">
        <div className="flex items-center gap-2">
          <Music />
          <span className="text-main-text text-text-1">기상음악 신청</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-caption-1">신청 음악</span>
          <span className="text-p-1 text-caption-1">{MOCK_SONGS.length}개</span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0 max-h-[600px] overflow-y-auto pr-2">
          <div className="flex flex-col">
            {MOCK_SONGS.map((music) => (
              <MusicListItem key={music.id} music={music} />
            ))}
          </div>
        </div>

        <div className="w-[330px] shrink-0 flex flex-col gap-20">
          <div className="flex flex-col gap-3">
            <span className="text-main-text text-text-2">음악 신청</span>
            <TextField
              placeholder="URL을 입력해주세요"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <TextButton variant="filled" size="wide" onClick={() => {}}>
              신청하기
            </TextButton>
          </div>

          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </section>
  );
}
