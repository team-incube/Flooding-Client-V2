import type { Music } from "../model/music";

export function randomSongs(songs: Music[], count: number): Music[] {
  return [...songs].sort(() => Math.random() - 0.5).slice(0, count);
}
