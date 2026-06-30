import type { SongAnalysis } from "@/features/wake-up-music-analysis/lib/songAnalysis";

const CACHE_NAME = "wake-up-music";

function key(kind: string, videoId: string): string {
  return `https://wum.cache/${kind}/${encodeURIComponent(videoId)}`;
}

export async function getCachedTranscript(
  videoId: string,
): Promise<string | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const res = await cache.match(key("transcript", videoId));
    return res ? res.text() : null;
  } catch {
    return null;
  }
}

export async function cacheTranscript(
  videoId: string,
  text: string,
): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(key("transcript", videoId), new Response(text));
  } catch {
    // 캐시 저장 실패는 무시
  }
}

export async function getCachedAnalysis(
  videoId: string,
): Promise<SongAnalysis | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const res = await cache.match(key("analysis", videoId));
    return res ? res.json() : null;
  } catch {
    return null;
  }
}

export async function cacheAnalysis(
  videoId: string,
  analysis: SongAnalysis,
): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      key("analysis", videoId),
      new Response(JSON.stringify(analysis)),
    );
  } catch {
    // 캐시 저장 실패는 무시
  }
}
