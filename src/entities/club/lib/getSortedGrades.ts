export function getSortedGrades(grouped: Record<number, unknown[]>): number[] {
  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);
}
