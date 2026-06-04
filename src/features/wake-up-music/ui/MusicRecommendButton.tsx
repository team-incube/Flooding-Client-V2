"use client";

import { useState } from "react";
import Star from "@/shared/asset/svg/Star";

interface MusicRecommendButtonProps {
  onClick: () => void;
}

export function MusicRecommendButton({ onClick }: MusicRecommendButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className="bg-p-2 relative flex size-13 cursor-pointer items-center justify-center rounded-full"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="pointer-events-none absolute right-0 bottom-full mb-4 max-w-[calc(100vw-3rem)]">
          <div className="bg-surface text-sub-1 relative rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-[0_0_24px_rgba(0,0,0,0.1)]">
            내가 최근 <span className="text-p-1">신청한 3곡</span>을 바탕으로
            노래를 추천받아봐요!
            <div className="bg-background-surface absolute right-[22px] -bottom-1.5 size-3 rotate-45"></div>
          </div>
        </div>
      )}
      <Star />
    </button>
  );
}
