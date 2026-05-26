"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";
import type { Music } from "@/entities/music/model/music";
import {
  dormitoryQueries,
  dormitoryMutations,
} from "@/entities/dormitory/api/dormitoryQueries";
import { formatDateParam } from "@/shared/lib/date";
import {
  captureFeatureAnomaly,
  captureFeatureError,
} from "@/shared/lib/sentry";

const FEATURE = "wake-up-music";

function isEmptyApplyBody(body: unknown) {
  return body === null || body === undefined;
}

export function useWakeUpMusic() {
  const queryClient = useQueryClient();
  const [urlInput, setUrlInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedDateString = formatDateParam(selectedDate);
  const musicQuery = dormitoryQueries.music(selectedDateString);

  const { data: songs = [] } = useQuery(musicQuery);

  const verifyApplyResult = async (submittedUrl: string) => {
    await queryClient.invalidateQueries({ queryKey: musicQuery.queryKey });
    const refreshed =
      queryClient.getQueryData<Music[]>(musicQuery.queryKey) ?? [];
    const found = refreshed.some((music) => music.musicUrl === submittedUrl);

    if (!found) {
      captureFeatureAnomaly({
        feature: FEATURE,
        action: "apply",
        anomaly: "post-apply-missing",
        message: "기상음악 신청: 200 응답 후 목록에 신청곡이 없음",
        extras: {
          submittedUrl,
          listSizeAfter: refreshed.length,
          date: selectedDateString,
        },
      });
    }
  };

  const applyMutation = useMutation({
    mutationFn: () => dormitoryMutations.applyMusic({ musicUrl: urlInput }),
    onMutate: () => {
      Sentry.addBreadcrumb({
        category: FEATURE,
        message: "apply",
        level: "info",
        data: { musicUrl: urlInput },
      });
    },
    onSuccess: async (response) => {
      const submittedUrl = urlInput;
      const body = response?.data;

      if (isEmptyApplyBody(body)) {
        captureFeatureAnomaly({
          feature: FEATURE,
          action: "apply",
          anomaly: "empty-200-response",
          message: "기상음악 신청: 200 응답이지만 본문이 비어있음",
          api: { status: response.status, body },
          extras: { musicUrl: submittedUrl },
        });
      }

      setUrlInput("");
      await verifyApplyResult(submittedUrl);
    },
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 기상음악을 신청했습니다.");
        return;
      }

      captureFeatureError(error, {
        feature: FEATURE,
        action: "apply",
        extras: { musicUrl: urlInput },
      });
      toast.error("기상음악 신청에 실패했습니다.");
    },
  });

  const handleSubmitRecommendedMusic = async (selectedUrl: string) => {
    Sentry.addBreadcrumb({
      category: FEATURE,
      message: "apply-recommended",
      level: "info",
      data: { musicUrl: selectedUrl },
    });

    try {
      const response = await dormitoryMutations.applyMusic({
        musicUrl: selectedUrl,
      });

      const body = response?.data;

      if (isEmptyApplyBody(body)) {
        captureFeatureAnomaly({
          feature: FEATURE,
          action: "apply-recommended",
          anomaly: "empty-200-response",
          message: "기상음악 추천 신청: 200 응답이지만 본문이 비어있음",
          api: { status: response.status, body },
          extras: { musicUrl: selectedUrl },
        });
      }

      await verifyApplyResult(selectedUrl);
    } catch (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 기상음악을 신청했습니다.");
        throw error;
      }

      captureFeatureError(error, {
        feature: FEATURE,
        action: "apply-recommended",
        extras: { musicUrl: selectedUrl },
      });
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
      Sentry.addBreadcrumb({
        category: FEATURE,
        message: music.isLiked ? "cancel-like" : "like",
        level: "info",
        data: { musicId: music.id },
      });
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
    onError: (error, music, context) => {
      if (context?.previousSongs) {
        queryClient.setQueryData(musicQuery.queryKey, context.previousSongs);
      }
      captureFeatureError(error, {
        feature: FEATURE,
        action: "like-toggle",
        extras: { musicId: music.id, wasLiked: music.isLiked },
      });
      toast.error("좋아요 처리에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: musicQuery.queryKey });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (musicId: number) => dormitoryMutations.deleteMusic(musicId),
    onMutate: async (musicId) => {
      Sentry.addBreadcrumb({
        category: FEATURE,
        message: "cancel",
        level: "info",
        data: { musicId },
      });
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
    onError: (error, musicId, context) => {
      if (context?.previousSongs) {
        queryClient.setQueryData(musicQuery.queryKey, context.previousSongs);
      }
      captureFeatureError(error, {
        feature: FEATURE,
        action: "cancel",
        extras: { musicId },
      });
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
    applyMutation,
    handleSubmitRecommendedMusic,
    likeMutation,
    cancelMutation,
  };
}
