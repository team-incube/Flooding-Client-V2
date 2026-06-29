import { YoutubeEmbed } from "@/entities/music/ui/YoutubeEmbed";
import { AiIssuesPanel } from "@/features/wake-up-music-analysis/ui/AiIssuesPanel";
import type { AiSongState } from "@/features/wake-up-music-analysis/model/useWakeUpMusicAiAnalysis";

interface MusicPlayerPanelProps {
  videoId: string | null;
  start: number;
  autoPlay: boolean;
  title: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  showAi: boolean;
  aiState?: AiSongState;
  onSeek: (seconds: number) => void;
}

export function MusicPlayerPanel({
  videoId,
  start,
  autoPlay,
  title,
  canPrev,
  canNext,
  onPrev,
  onNext,
  showAi,
  aiState,
  onSeek,
}: MusicPlayerPanelProps) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
      <div className="bg-sub-4 overflow-hidden rounded-2xl">
        {videoId ? (
          <YoutubeEmbed videoId={videoId} start={start} autoPlay={autoPlay} />
        ) : (
          <div className="text-sub-1 text-caption-1 flex aspect-video items-center justify-center">
            재생할 수 있는 영상이 없습니다.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="text-caption-2 text-sub-1 hover:text-p-1 disabled:text-sub-3 cursor-pointer transition-colors disabled:cursor-default"
        >
          &lt; 이전곡
        </button>
        <span className="text-text-2 text-main-text min-w-0 flex-1 truncate text-center font-semibold">
          {title}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="text-caption-2 text-sub-1 hover:text-p-1 disabled:text-sub-3 cursor-pointer transition-colors disabled:cursor-default"
        >
          다음곡 &gt;
        </button>
      </div>

      {showAi && (
        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <span className="text-caption-2 text-sub-1 font-medium">AI 분석</span>
          <AiIssuesPanel state={aiState} onSeek={onSeek} />
        </div>
      )}
    </div>
  );
}
