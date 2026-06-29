import type { ChatCompletionMessageParam } from "@mlc-ai/web-llm";

export type SongRating = "적합" | "주의" | "부적합";

export interface SongAnalysis {
  summary: string;
  rating: SongRating;
  issues: string[];
}

const MAX_TRANSCRIPT_CHARS = 3000;

export const SONG_ANALYSIS_SCHEMA = JSON.stringify({
  type: "object",
  properties: {
    summary: { type: "string" },
    rating: { type: "string", enum: ["적합", "주의", "부적합"] },
    issues: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "rating", "issues"],
});

export function buildSongAnalysisMessages(
  title: string,
  transcript: string,
): ChatCompletionMessageParam[] {
  const clipped = transcript.slice(0, MAX_TRANSCRIPT_CHARS);

  return [
    {
      role: "system",
      content:
        "당신은 기숙사 사감을 돕는 음악 검토 도우미입니다. 학생 기상음악으로 적합한지 자막(가사)을 보고 판단합니다.\n" +
        "자막의 각 줄은 '[시간] 가사' 형식이며, [시간]은 그 가사가 나오는 영상 시점입니다.\n" +
        "규칙:\n" +
        "- 설명·요약은 한국어로 쓴다. 단, issues에서 인용하는 가사 원문은 자막에 적힌 언어 그대로 둔다. 그 외에 중국어 등 의미 없는 언어를 섞지 않는다.\n" +
        "- JSON 객체 하나만 출력한다. 설명·코드펜스·다른 텍스트를 덧붙이지 않는다.\n" +
        '- 출력 형식: {"summary": string, "rating": "적합"|"주의"|"부적합", "issues": string[]}\n' +
        "- summary: 곡의 분위기와 내용을 한국어 한 줄로 요약한다.\n" +
        '- rating: "적합"=밝고 무난, "주의"=다소 부적절하여 사감 확인 필요, "부적합"=욕설·선정성·폭력 등 명백히 부적절.\n' +
        "- issues: 부적절한 표현이 나온 부분을 '[시간] \"자막 원문 그대로\" 사유' 형식으로 적는다. [시간]과 큰따옴표 안 가사는 자막 줄을 글자 그대로(번역·요약·수정 금지) 옮겨 음성과 일치시킨다. 사유만 한국어로 짧게 덧붙인다. 자막에 실제로 있는 표현만, 없으면 빈 배열 []. 지어내지 않는다.",
    },
    {
      role: "user",
      content: `제목: ${title}\n\n자막:\n${clipped}`,
    },
  ];
}

export function parseSongAnalysis(content: string): SongAnalysis {
  return JSON.parse(content) as SongAnalysis;
}

export interface IssueTimestamp {
  seconds: number;
  time: string;
  rest: string;
}

export function parseLeadingTimestamp(issue: string): IssueTimestamp | null {
  const match = issue.match(/^\[(\d+):(\d{2})(?::(\d{2}))?\]\s*(.*)$/);
  if (!match) return null;

  const [, a, b, c, rest] = match;
  const seconds = c
    ? Number(a) * 3600 + Number(b) * 60 + Number(c)
    : Number(a) * 60 + Number(b);
  const time = c ? `${a}:${b}:${c}` : `${a}:${b}`;

  return { seconds, time, rest };
}
