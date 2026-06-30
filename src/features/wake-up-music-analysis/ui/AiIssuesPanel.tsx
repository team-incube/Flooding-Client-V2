import { Skeleton } from "@/shared/ui/Skeleton";
import { parseLeadingTimestamp } from "@/features/wake-up-music-analysis/lib/songAnalysis";
import type { SongAnalysis } from "@/features/wake-up-music-analysis/lib/songAnalysis";
import type { AiSongState } from "@/features/wake-up-music-analysis/model/useWakeUpMusicAiAnalysis";

interface AiIssuesPanelProps {
  state?: AiSongState;
  onSeek: (seconds: number) => void;
}

function AiIssuesPanelEmpty() {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <span className="text-text-3 text-sub-1 line-clamp-2 max-w-full text-center font-medium break-all">
        AI 분석 결과가 없습니다.
      </span>
    </div>
  );
}

function AiIssuesPanelLoading() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      <Skeleton className="h-4 w-2/3 rounded" />
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  );
}

function AiIssuesPanelError({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <span className="text-text-3 text-negative line-clamp-2 max-w-full text-center font-medium break-all">
        {message}
      </span>
    </div>
  );
}

function AiIssuesPanelResult({
  analysis,
  onSeek,
}: {
  analysis: SongAnalysis;
  onSeek: (seconds: number) => void;
}) {
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
        <AiIssuesPanel.Empty />
      )}
    </div>
  );
}

function AiIssuesPanel({ state, onSeek }: AiIssuesPanelProps) {
  if (!state) {
    return <AiIssuesPanel.Empty />;
  }

  if (state.status === "transcript" || state.status === "analyzing") {
    return <AiIssuesPanel.Loading />;
  }

  if (state.status === "error") {
    return <AiIssuesPanel.Error message={state.message} />;
  }

  return <AiIssuesPanelResult analysis={state.analysis} onSeek={onSeek} />;
}

AiIssuesPanel.Empty = AiIssuesPanelEmpty;
AiIssuesPanel.Loading = AiIssuesPanelLoading;
AiIssuesPanel.Error = AiIssuesPanelError;

export { AiIssuesPanel };
