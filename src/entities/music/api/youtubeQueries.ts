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

export const youtubeQueries = {
  videos: (videoIds: string[]) => {
    const ids = Array.from(new Set(videoIds)).sort();

    return queryOptions({
      queryKey: ["music", "youtube-videos", ids.join(",")],
      queryFn: ({ signal }) => getYoutubeVideos(ids, signal),
      enabled: ids.length > 0,
    });
  },
} as const;
