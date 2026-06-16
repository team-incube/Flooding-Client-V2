"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DormitoryMusicQueryParams } from "@/entities/dormitory/model/dormitory";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import type { Music } from "@/entities/music/model/music";
import {
  dormitoryQueries,
  dormitoryMutations,
  dormitoryRequests,
} from "@/entities/dormitory/api/dormitoryQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import { formatDateParam } from "@/shared/lib/date";
import { todayKst } from "@/shared/lib/kst";
import { createMusicPermission } from "@/entities/dormitory/lib/musicPermission";
import { getInitialMusicDate } from "@/features/wake-up-music/lib/date";
import { musicUrlSchema } from "@/features/wake-up-music/lib/wakeUpMusicSchema";
import { extractYoutubeVideoId } from "@/entities/music/lib/youtube";
import { youtubeQueries } from "@/entities/music/api/youtubeQueries";

export function useWakeUpMusic(filterParams?: DormitoryMusicQueryParams) {
  const queryClient = useQueryClient();
  const [urlInput, setUrlInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(getInitialMusicDate);

  const canApply = musicUrlSchema.safeParse(urlInput).success;

  const selectedDateString = formatDateParam(selectedDate);
  const isToday = selectedDateString === formatDateParam(todayKst());
  const musicQuery = dormitoryQueries.music(selectedDateString, filterParams);

  const { data: songs = [] } = useQuery(musicQuery);
  const { data: me } = useQuery(userQueries.me());

  const videoIds = songs
    .map((music) => extractYoutubeVideoId(music.videoUrl ?? music.musicUrl))
    .filter((id): id is string => Boolean(id));

  const { data: youtubeVideos = {} } = useQuery(
    youtubeQueries.videos(videoIds),
  );

  const enrichedSongs = songs.map((music) => {
    const videoId = extractYoutubeVideoId(music.videoUrl ?? music.musicUrl);
    const meta = videoId ? youtubeVideos[videoId] : undefined;

    if (!meta) return music;

    return {
      ...music,
      duration: music.duration ?? meta.duration,
      durationText: music.durationText ?? meta.durationText,
    };
  });

  const applyMutation = useMutation({
    mutationKey: dormitoryMutations.applyMusic().mutationKey,
    mutationFn: () => dormitoryRequests.applyMusic({ musicUrl: urlInput }),
    meta: {
      getExtras: () => ({ musicUrl: urlInput }),
    },
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

  const handleApplyMusic = () => {
    if (!canApply || applyMutation.isPending) return;
    applyMutation.mutate();
  };

  const likeMutation = useMutation({
    mutationKey: ["dormitory", "music-like-toggle"],
    mutationFn: (music: Music) =>
      music.isLiked
        ? dormitoryRequests.cancelLikeMusic(music.id)
        : dormitoryRequests.likeMusic(music.id),
    meta: {
      getExtras: (music: Music) => ({
        musicId: music.id,
        wasLiked: music.isLiked,
      }),
    },
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: musicQuery.queryKey });
    },
  });

  const cancelMutation = useMutation({
    ...dormitoryMutations.deleteMusic(),
    meta: {
      getExtras: (musicId: number) => ({ musicId }),
    },
    onMutate: async (musicId) => {
      await queryClient.cancelQueries({ queryKey: musicQuery.queryKey });
      const previousSongs = queryClient.getQueryData<Music[]>(
        musicQuery.queryKey,
      );
      queryClient.setQueryData<Music[]>(
        musicQuery.queryKey,
        (current) => current?.filter((item) => item.id !== musicId) ?? [],
      );
      return { previousSongs };
    },
    onSuccess: () => {
      toast.success("기상음악 신청이 취소되었습니다.");
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

  const { canDeleteAnyMusic } = createMusicPermission({ role: me?.role });

  return {
    urlInput,
    setUrlInput,
    canApply,
    isToday,
    selectedDate,
    setSelectedDate,
    songs: enrichedSongs,
    me,
    canDeleteAnyMusic,
    applyMutation,
    handleApplyMusic,
    likeMutation,
    cancelMutation,
  };
}
