"use client";

import VinylRecord from "@/shared/asset/svg/VinylRecord";
import Chatbot from "@/shared/asset/svg/Chatbot";

interface AiSongThumbnailLoadingProps {
  variant: "transcript" | "analyzing";
}

export function AiSongThumbnailLoading({
  variant,
}: AiSongThumbnailLoadingProps) {
  return (
    <span className="bg-background/70 pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg">
      {variant === "analyzing" ? (
        <span className="relative grid animate-spin place-items-center motion-reduce:animate-none">
          <VinylRecord size={36} />
          <span className="pointer-events-none absolute block size-3">
            <Chatbot />
          </span>
        </span>
      ) : (
        <span className="border-sub-3 border-t-p-1 size-7 animate-spin rounded-full border-[3px] motion-reduce:animate-none" />
      )}
    </span>
  );
}
