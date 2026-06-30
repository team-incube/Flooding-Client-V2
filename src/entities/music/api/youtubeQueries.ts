import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";

export interface YoutubeVideoMetadata {
  id: string;
  title: string;
  duration: string;
  durationText: string;
  thumbnailUrl: string;
}

interface YoutubeVideosResponse {
  videos: YoutubeVideoMetadata[];
}

export interface YoutubeTranscript {
  text: string;
}

export async function getYoutubeVideos(
  videoIds: string[],
  signal?: AbortSignal,
): Promise<Record<string, YoutubeVideoMetadata>> {
  const ids = Array.from(new Set(videoIds)).filter(Boolean);

  if (!ids.length) {
    return {};
  }

  const { data } = await instance.get<YoutubeVideosResponse>(
    "/api/youtube/videos",
    {
      baseURL: undefined,
      params: { ids: ids.join(",") },
      signal,
    },
  );

  return Object.fromEntries(data.videos.map((video) => [video.id, video]));
}

const TRANSCRIPT_TIMEOUT_MS = 65_000;

export async function getYoutubeTranscript(
  videoId: string,
  signal?: AbortSignal,
): Promise<YoutubeTranscript> {
  const { data } = await instance.get<YoutubeTranscript>(
    "/api/youtube/transcript",
    {
      baseURL: undefined,
      params: { id: videoId },
      timeout: TRANSCRIPT_TIMEOUT_MS,
      signal,
    },
  );

  return data;
}

export const youtubeQueries = {
  videos: (videoIds: string[]) => {
    const ids = Array.from(new Set(videoIds)).sort();

    return queryOptions({
      queryKey: ["music", "youtube-videos", ids.join(",")],
      queryFn: ({ signal }) => getYoutubeVideos(ids, signal),
      enabled: ids.length > 0,
    });
  },

  transcript: (videoId: string) =>
    queryOptions({
      queryKey: ["music", "youtube-transcript", videoId],
      queryFn: ({ signal }) => getYoutubeTranscript(videoId, signal),
      enabled: Boolean(videoId),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
} as const;
