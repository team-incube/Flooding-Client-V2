export const FLOORS = [
  { value: "2F", label: "2층" },
  { value: "3F", label: "3층" },
  { value: "4F", label: "4층" },
];

export const PERIODS = ["8교시", "9교시", "10교시", "11교시"];

export const PERIODS_TIME: Record<string, string> = {
  "8교시": "16:40",
  "9교시": "17:40",
  "10교시": "19:30",
  "11교시": "20:30",
};

export const TABLE_MAX_PERSONNEL = {
  "2F": { "1": 6, "2": 4, "3": 4 },
  "3F": { "1": 6, "2": 6, "3": 4, "5": 4, "6": 4 },
  "4F": { "1": 6, "2": 6, "3": 4, "4": 4 },
} as const;
