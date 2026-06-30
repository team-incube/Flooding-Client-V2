import Back from "@/shared/asset/svg/Back";
import { YoutubeEmbed } from "@/entities/music/ui/YoutubeEmbed";
import { NoteText } from "@/shared/ui/NoteText";
import { NoteTooltip } from "@/shared/ui/NoteTooltip";
import { AiRatingBadge } from "@/features/wake-up-music-analysis/ui/AiRatingBadge";
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
    <div data-tooltip-card className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="bg-sub-4 rounded-2xl">
        {videoId ? (
          <YoutubeEmbed videoId={videoId} start={start} autoPlay={autoPlay} />
        ) : (
          <div className="text-sub-1 text-caption-1 flex aspect-video items-center justify-center">
            재생할 수 있는 영상이 없습니다.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 py-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="text-caption-2 text-sub-1 hover:text-p-1 disabled:text-sub-3 inline-flex cursor-pointer items-center gap-1 transition-colors disabled:cursor-default"
        >
          <Back direction="left" size={16} />
          이전곡
        </button>
        <span className="text-title-4 text-main-text min-w-0 flex-1 truncate text-center font-semibold">
          {title}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="text-caption-2 text-sub-1 hover:text-p-1 disabled:text-sub-3 inline-flex cursor-pointer items-center gap-1 transition-colors disabled:cursor-default"
        >
          다음곡
          <Back direction="right" size={16} />
        </button>
      </div>

      {showAi && (
        <div className="flex min-h-0 flex-col gap-4 lg:flex-1 max-lg:h-80">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-text-2 text-main-text font-semibold">
                  AI 분석
                </span>
                <NoteTooltip
                  className=""
                  ariaLabel="AI 분석 안내 보기"
                  notes={[
                    "분석에는 수 분이 걸릴 수 있으며, 너무 자주 실행하면 자막 추출이 차단될 수 있으니 하루 5회 이하 사용을 권장드립니다.",
                    "※ 동일한 영상일 경우 다시 분석되지 않지만 브라우저 캐시를 초기화할 경우 다시 분석됩니다.",
                  ]}
                />
              </div>
              <AiRatingBadge state={aiState} />
            </div>
            <NoteText multiline>
              ※ 해당 분석 결과는 AI로 생성되었으며 실수할 수 있습니다. 응답을
              다시 한번 확인해 주세요.
            </NoteText>
          </div>
          <AiIssuesPanel state={aiState} onSeek={onSeek} />
        </div>
      )}
    </div>
  );
}
