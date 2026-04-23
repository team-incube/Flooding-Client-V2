"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import type { Music } from "@/entities/music/model/music";
import { extractYoutubeVideoId } from "@/entities/music/lib/youtube";
import { youtubeQueries } from "@/entities/music/api/youtubeQueries";
import {
  dormitoryQueries,
  dormitoryMutations,
} from "@/entities/dormitory/api/dormitoryQueries";
import { formatDate } from "@/features/wake-up-music/lib/formatDate";

export function useWakeUpMusic() {
  const queryClient = useQueryClient();
  const [urlInput, setUrlInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedDateString = formatDate(selectedDate);
  const musicQuery = dormitoryQueries.music(selectedDateString);

  const { data: songs = [] } = useQuery(musicQuery);

  const youtubeVideoIds = songs
    .map((music) => extractYoutubeVideoId(music.musicUrl))
    .filter((id): id is string => Boolean(id));
  const { data: youtubeVideos = {} } = useQuery(
    youtubeQueries.videos(youtubeVideoIds),
  );

  const applyMutation = useMutation({
    mutationFn: () => dormitoryMutations.applyMusic({ musicUrl: urlInput }),
    onSuccess: () => {
      setUrlInput("");
      queryClient.invalidateQueries({ queryKey: musicQuery.queryKey });
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 기상음악을 신청했습니다.");
        return;
      }

      toast.error("기상음악 신청에 실패했습니다.");
    },
  });

  const handleSubmitRecommendedMusic = async (selectedUrls: string[]) => {
    try {
      for (const url of selectedUrls) {
        await dormitoryMutations.applyMusic({ musicUrl: url });
      }

      await queryClient.invalidateQueries({ queryKey: ["dormitory", "music"] });
    } catch (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 기상음악을 신청했습니다.");
        throw error;
      }

      toast.error("기상음악 신청에 실패했습니다.");
      throw error;
    }
  };

  const likeMutation = useMutation({
    mutationFn: (music: Music) =>
      music.isLiked
        ? dormitoryMutations.cancelLikeMusic(music.id)
        : dormitoryMutations.likeMusic(music.id),
    onMutate: async (music) => {
      await queryClient.cancelQueries({ queryKey: musicQuery.queryKey });
      const previousSongs = queryClient.getQueryData<Music[]>(
        musicQuery.queryKey,
      );
      queryClient.setQueryData<Music[]>(musicQuery.queryKey, (current) =>
        current?.map((item) => {
          if (item.id !== music.id) return item;
          const isLiked = !item.isLiked;
          const likeCount = isLiked
            ? item.likeCount + 1
            : Math.max(0, item.likeCount - 1);
          return { ...item, isLiked, likeCount };
        }),
      );
      return { previousSongs };
    },
    onError: (_error, _music, context) => {
      if (context?.previousSongs) {
        queryClient.setQueryData(musicQuery.queryKey, context.previousSongs);
      }
      toast.error("좋아요 처리에 실패했습니다.");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (musicId: number) => dormitoryMutations.deleteMusic(musicId),
    onMutate: async (musicId) => {
      await queryClient.cancelQueries({ queryKey: musicQuery.queryKey });
      const previousSongs = queryClient.getQueryData<Music[]>(
        musicQuery.queryKey,
      );
      queryClient.setQueryData<Music[]>(musicQuery.queryKey, (current) =>
        current?.filter((item) => item.id !== musicId) ?? [],
      );
      return { previousSongs };
    },
    onError: (_error, _musicId, context) => {
      if (context?.previousSongs) {
        queryClient.setQueryData(musicQuery.queryKey, context.previousSongs);
      }
      toast.error("기상음악 취소에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: musicQuery.queryKey });
    },
  });

  return {
    urlInput,
    setUrlInput,
    selectedDate,
    setSelectedDate,
    songs,
    youtubeVideos,
    applyMutation,
    handleSubmitRecommendedMusic,
    likeMutation,
    cancelMutation,
  };
}
