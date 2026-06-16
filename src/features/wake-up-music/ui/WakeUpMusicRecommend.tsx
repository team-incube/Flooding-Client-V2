"use client";

import { useState } from "react";
import { MusicRecommendButton } from "@/features/wake-up-music/ui/MusicRecommendButton";
import { MusicRecommendModal } from "@/features/wake-up-music/ui/MusicRecommendModal";
import { useApplyRecommendedMusic } from "@/features/wake-up-music/model/useApplyRecommendedMusic";

interface WakeUpMusicRecommendProps {
  className?: string;
}

export function WakeUpMusicRecommend({ className }: WakeUpMusicRecommendProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmitRecommendedMusic } = useApplyRecommendedMusic();

  return (
    <>
      <div className={className}>
        <MusicRecommendButton onClick={() => setIsModalOpen(true)} />
      </div>

      {isModalOpen && (
        <MusicRecommendModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitRecommendedMusic}
        />
      )}
    </>
  );
}
