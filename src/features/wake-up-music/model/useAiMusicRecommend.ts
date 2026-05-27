"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import { aiMutations } from "@/entities/ai/api/aiMutations";
import { extractYoutubeVideoId } from "@/entities/music/lib/youtube";
import { youtubeQueries } from "@/entities/music/api/youtubeQueries";

const MAX_RETRY = 3;
type RecommendEmptyReason = "NO_HISTORY" | "NO_RECOMMENDATIONS";

export function useAiMusicRecommend(enabled: boolean) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([]);
  const [emptyReason, setEmptyReason] = useState<RecommendEmptyReason | null>(
    null,
  );

  const { mutate: recommendMusic, isPending } = useMutation({
    ...aiMutations.recommendSong(),
    onMutate: () => {
      setYoutubeLinks([]);
      setSelectedUrl(null);
      setEmptyReason(null);
    },
    onSuccess: ({ data }) => {
      const youtubeLinks = data.data?.youtube_links;

      if (!Array.isArray(youtubeLinks) || youtubeLinks.length === 0) {
        setYoutubeLinks([]);
        setSelectedUrl(null);
        setEmptyReason("NO_RECOMMENDATIONS");
        return;
      }

      setYoutubeLinks(youtubeLinks);
      setSelectedUrl(null);
      setEmptyReason(null);
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.NotFound) {
        setYoutubeLinks([]);
        setSelectedUrl(null);
        setEmptyReason("NO_HISTORY");
        return;
      }

      if (status === HttpStatusCode.Unauthorized) {
        toast.error("로그인이 만료되었습니다. 다시 로그인해주세요.");
        return;
      }

      if (status === HttpStatusCode.Forbidden) {
        toast.error("AI 노래 추천을 사용할 권한이 없습니다.");
        return;
      }

      if (status === HttpStatusCode.BadGateway) {
        toast.error("AI 노래 추천 서버 응답에 실패했습니다.");
        return;
      }

      toast.error("AI 노래 추천에 실패했습니다.");
    },
  });

  useEffect(() => {
    if (enabled) {
      recommendMusic();
    }
  }, [enabled, recommendMusic]);

  const videoIds = youtubeLinks
    .map(extractYoutubeVideoId)
    .filter((id): id is string => Boolean(id));

  const { data: youtubeVideos = {} } = useQuery(
    youtubeQueries.videos(videoIds),
  );

  const displayCards = youtubeLinks.map((url) => {
    const id = extractYoutubeVideoId(url) ?? "";
    const meta = youtubeVideos[id];
    return {
      url,
      title: meta?.title ?? "",
      thumbnailUrl: meta?.thumbnailUrl ?? "",
    };
  });

  const handleSelect = (url: string) => {
    setSelectedUrl((prev) => (prev === url ? null : url));
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRY) {
      setRetryCount((prev) => prev + 1);
      recommendMusic();
    }
  };

  return {
    displayCards,
    emptyReason,
    selectedUrl,
    retryCount,
    maxRetry: MAX_RETRY,
    isActive: selectedUrl !== null,
    isPending,
    handleSelect,
    handleRetry,
  };
}
