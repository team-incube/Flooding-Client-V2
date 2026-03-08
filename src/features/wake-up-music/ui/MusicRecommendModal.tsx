"use client";

import { useState } from "react";
import SmallStar from "@/shared/asset/svg/SmallStar";
import Cancel from "@/shared/asset/svg/Cancel";
import { RECOMMEND_MUSIC, RecommendMusic } from "@/entities/music/model/recommendMock";
import MusicRecommendCard from "@/features/wake-up-music/ui/MusicRecommendCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import RetryButton from "@/shared/ui/Button/RetryButton";

interface MusicRecommendModalProps {
  open: boolean;
  onClose: () => void;
}

export function MusicRecommendModal({ open, onClose }: MusicRecommendModalProps) {
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((v) => v !== id));
      return;
    }

    if (selected.length >= 3) return;

    setSelected([...selected, id]);
  };

  const isAcitve = selected.length > 0;
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F7F7F9]/50 z-50">
      <div className="flex flex-col gap-4 bg-background-surface rounded-2xl p-6 w-[90%] max-w-[1152px] min-h-[447px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <SmallStar />
              <span className="text-main-text text-text-1">오늘의 노래 추천</span>
            </div>

            <button onClick={onClose} className="cursor-pointer ">
              <Cancel />
            </button>
          </div>
          <span className="text-sub-2">
            ※ 노래 추천은 이전에 신청한 곡을 기반으로 노래를 추천해요
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto">
          {RECOMMEND_MUSIC.map((music) => (
            <MusicRecommendCard
              key={music.id}
              title={music.title}
              thumbnailUrl={music.thumbnailUrl}
              checked={selected.includes(music.id)}
              onChange={() => handleSelect(music.id)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <RetryButton />
          <div className={!isAcitve ? "point-events-none opacity-50" : "cursor-pointer"}>
            <TextButton 
              variant={isAcitve ? "filled" : "outlined"} 
              size="medium"
              onClick={() => {}}
            >
              음악 신청하기
            </TextButton>
          </div>
        </div>
      </div>
    </div>
  );
}