"use client";

import { useState } from "react";
import type { Music } from "@/entities/music/model/music";
import { randomSongs } from "@/entities/music/lib/randomSongs";

const MAX_RETRY = 3;

export function useMusicRecommendSelection(songs: Music[]) {
  const [selected, setSelected] = useState<number[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [displaySongs, setDisplaySongs] = useState(() =>
    randomSongs(songs, 3),
  );

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((v) => v !== id));
      return;
    }
    if (selected.length >= 3) return;
    setSelected([...selected, id]);
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRY) {
      setRetryCount((prev) => prev + 1);
      setDisplaySongs(randomSongs(songs, 3));
    }
  };

  return {
    selected,
    displaySongs,
    retryCount,
    maxRetry: MAX_RETRY,
    isActive: selected.length > 0,
    handleSelect,
    handleRetry,
  };
}
