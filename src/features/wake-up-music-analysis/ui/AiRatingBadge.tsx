import type { AiSongState } from "@/features/wake-up-music-analysis/model/useWakeUpMusicAiAnalysis";
import type { SongRating } from "@/features/wake-up-music-analysis/lib/songAnalysis";

const ratingStyles: Record<SongRating, string> = {
  적합: "text-p-1 bg-p-3",
  주의: "text-orange-300 bg-sub-3",
  부적합: "text-negative bg-sub-3",
};

interface AiRatingBadgeProps {
  state?: AiSongState;
}

export function AiRatingBadge({ state }: AiRatingBadgeProps) {
  if (!state) return null;

  if (state.status === "transcript" || state.status === "analyzing") {
    return (
      <span className="text-sub-1 text-caption-2">
        {state.status === "transcript" ? "자막 수집 중…" : "분석 중…"}
      </span>
    );
  }

  if (state.status === "error") {
    return <span className="text-negative text-caption-2">분석 실패</span>;
  }

  return (
    <div className="flex gap-2">
      <span
        className={`text-caption-2 w-fit rounded-full px-2 py-0.5 ${ratingStyles[state.analysis.rating]}`}
      >
        {state.analysis.rating}
      </span>
      {state.analysis.autoCaption && (
        <span
          className={`text-caption-2 w-fit rounded-full px-2 py-0.5 ${ratingStyles["주의"]}`}
        >
          자동 생성
        </span>
      )}
    </div>
  );
}
