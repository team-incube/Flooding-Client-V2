const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function extractYoutubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return isYoutubeVideoId(videoId) ? videoId : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const watchId = parsedUrl.searchParams.get("v");
      if (isYoutubeVideoId(watchId)) {
        return watchId;
      }

      const [type, videoId] = parsedUrl.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(type) && isYoutubeVideoId(videoId)) {
        return videoId;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYoutubeThumbnailUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url);

  if (!videoId) {
    return null;
  }

  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

export function formatYoutubeDuration(duration: string): string {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);

  if (!match) {
    return "";
  }

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function isYoutubeVideoId(value: string | null | undefined): value is string {
  return Boolean(value && YOUTUBE_ID_PATTERN.test(value));
}
