import { Skeleton } from "@/shared/ui/Skeleton";
import { parseLeadingTimestamp } from "@/features/wake-up-music-analysis/lib/songAnalysis";
import type { AiSongState } from "@/features/wake-up-music-analysis/model/useWakeUpMusicAiAnalysis";

interface AiIssuesPanelProps {
  state?: AiSongState;
  onSeek: (seconds: number) => void;
}

function AiIssuesMessage({
  children,
  isError = false,
}: {
  children: string;
  isError?: boolean;
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <span
        className={`text-text-3 font-medium ${isError ? "text-negative" : "text-sub-1"}`}
      >
        {children}
      </span>
    </div>
  );
}

export function AiIssuesPanel({ state, onSeek }: AiIssuesPanelProps) {
  if (!state) {
    return <AiIssuesMessage>AI 분석 결과가 없습니다.</AiIssuesMessage>;
  }

  if (state.status === "transcript" || state.status === "analyzing") {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return <AiIssuesMessage isError>{state.message}</AiIssuesMessage>;
  }

  const { analysis } = state;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
      {analysis.summary && (
        <p className="text-sub-1 text-caption-1">{analysis.summary}</p>
      )}
      {analysis.issues.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {analysis.issues.map((issue, index) => {
            const timestamp = parseLeadingTimestamp(issue);

            return (
              <li
                key={index}
                className="border-sub-4 bg-background-surface text-caption-1 text-main-text rounded-xl border px-4 py-3"
              >
                {timestamp ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onSeek(timestamp.seconds)}
                      className="text-p-1 cursor-pointer font-medium underline"
                    >
                      [{timestamp.time}]
                    </button>{" "}
                    {timestamp.rest}
                  </>
                ) : (
                  issue
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <AiIssuesMessage>지적된 표현이 없습니다.</AiIssuesMessage>
      )}
    </div>
  );
}
