"use client";

import VinylRecord from "@/shared/asset/svg/VinylRecord";
import Chatbot from "@/shared/asset/svg/Chatbot";

interface MusicRecommendLoadingProps {
  stage: "recommend" | "youtube";
}

const stageMessage = {
  recommend: "AI가 곡을 고르고 있어요",
  youtube: "영상 정보를 불러오고 있어요",
} as const;

export function MusicRecommendLoading({ stage }: MusicRecommendLoadingProps) {
  return (
    <div className="flex min-h-[230px] w-full flex-col items-center justify-center gap-5">
      <div className="relative grid animate-spin place-items-center motion-reduce:animate-none">
        <VinylRecord size={104} />
        <span className="pointer-events-none absolute block size-9">
          <Chatbot />
        </span>
      </div>
      <p className="text-text-2 text-main-text">{stageMessage[stage]}</p>
    </div>
  );
}
