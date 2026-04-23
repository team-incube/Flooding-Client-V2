import axios, { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { formatYoutubeDuration } from "@/entities/music/lib/youtube";

interface YoutubeVideoItem {
  id: string;
  snippet?: {
    title?: string;
    thumbnails?: {
      default?: { url?: string };
      medium?: { url?: string };
      high?: { url?: string };
      standard?: { url?: string };
      maxres?: { url?: string };
    };
  };
  contentDetails?: {
    duration?: string;
  };
}

interface YoutubeVideosResponse {
  items?: YoutubeVideoItem[];
}

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams
    .get("ids")
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!ids?.length) {
    return NextResponse.json({ videos: [] });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY 없음" },
      { status: HttpStatusCode.InternalServerError },
    );
  }

  try {
    const { data } = await axios.get<YoutubeVideosResponse>(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails",
          id: ids.slice(0, 50).join(","),
          key: apiKey,
        },
      },
    );

    const videos =
      data.items?.map((item) => {
        const duration = item.contentDetails?.duration ?? "";

        return {
          id: item.id,
          title: item.snippet?.title ?? "",
          duration,
          durationText: duration ? formatYoutubeDuration(duration) : "",
          thumbnailUrl:
            item.snippet?.thumbnails?.maxres?.url ??
            item.snippet?.thumbnails?.standard?.url ??
            item.snippet?.thumbnails?.high?.url ??
            item.snippet?.thumbnails?.medium?.url ??
            item.snippet?.thumbnails?.default?.url ??
            "",
        };
      }) ?? [];

    return NextResponse.json({ videos });
  } catch (error) {
    const fallbackBody = { error: "YouTube 영상 정보 조회 실패" };

    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;
      return NextResponse.json(data ?? fallbackBody, { status });
    }

    return NextResponse.json(fallbackBody, {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
