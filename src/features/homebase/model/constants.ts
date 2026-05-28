export const FLOORS = [
  { value: "2F", label: "2층" },
  { value: "3F", label: "3층" },
  { value: "4F", label: "4층" },
];

export const HOMEBASE_SCHEDULE = {
  periods: {
    "5교시": { start: "13:30", end: "14:20" },
    "8교시": { start: "16:40", end: "17:30" },
    "9교시": { start: "17:40", end: "18:30" },
    "10교시": { start: "19:30", end: "20:20" },
    "11교시": { start: "20:30", end: "21:20" },
  } as Record<string, { start: string; end: string }>,
};

export const PERIODS = ["8교시", "9교시", "10교시", "11교시"];

export const TABLE_MAX_PERSONNEL = {
  "2F": { "1": 6, "2": 4, "3": 4 },
  "3F": { "1": 6, "2": 6, "3": 4, "5": 4, "6": 4 },
  "4F": { "1": 6, "2": 6, "3": 4, "4": 4 },
} as const;
