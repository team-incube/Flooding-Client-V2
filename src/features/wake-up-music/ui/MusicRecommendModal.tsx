"use client";

import { useState } from "react";
import SmallStar from "@/shared/asset/svg/SmallStar";
import Cancel from "@/shared/asset/svg/Cancel";
import MusicRecommendCard from "@/features/wake-up-music/ui/MusicRecommendCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import RetryButton from "@/shared/ui/Button/RetryButton";
import { MOCK_SONGS } from "@/entities/music/model/mock";

interface MusicRecommendModalProps {
  open: boolean;
  onClose: () => void;
}

const randomSongs = (song: typeof MOCK_SONGS, count: number) => {
  return [...song].sort(() => Math.random() - 0.5).splice(0, count);
}

export function MusicRecommendModal({ open, onClose }: MusicRecommendModalProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [displaySongs, setDisplaySongs] = useState(() => randomSongs(MOCK_SONGS, 3));
  const maxRetry = 3;

  const handleRetry = () => {
    if (retryCount < maxRetry) {
      setRetryCount(prev => prev + 1);
      
      const newSongs = randomSongs(MOCK_SONGS, 3);
      setDisplaySongs(newSongs)
    }
  }

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
      <div className="flex flex-col gap-6 bg-background-surface rounded-2xl p-6 w-[90%] max-w-[1152px] min-h-[447px]">
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
          {displaySongs.map((music) => (
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
          <RetryButton
            onClick={handleRetry}
            count={retryCount}
            max={maxRetry}
          />
          <div className={!isAcitve ? "pointer-events-none opacity-50" : "cursor-pointer"}>
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