export function randomSongs<T>(songs: T[], count: number): T[] {
  return [...songs].sort(() => Math.random() - 0.5).slice(0, count);
}
