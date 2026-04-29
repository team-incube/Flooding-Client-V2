import ChevronRight from "@/shared/asset/svg/Back";
import { TextButton } from "@/shared/ui/Button/TextButton";
import type { TextButtonVariant } from "@/shared/ui/Button/TextButton";

interface ApplyCardProps {
  title: string;
  icon: React.ReactNode;
  current: number;
  total: number;
  timeText: string;
  buttonText: string;
  buttonVariant?: TextButtonVariant;
  disabled?: boolean;
  femaleNotice?: boolean;
  onApply?: () => void;
}

export default function ApplyCard({
  title,
  icon,
  current,
  total,
  timeText,
  buttonText,
  buttonVariant = "filled",
  disabled = false,
  femaleNotice = false,
  onApply,
}: ApplyCardProps) {
  const isApplyEnabled = !disabled;
  const visualButtonVariant =
    disabled && buttonVariant === "filled" ? "disabled" : buttonVariant;

  return (
    <div className="w-full bg-background-surface rounded-2xl p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1">
          <div>{icon}</div>
          <span className="text-text-1 font-semibold text-main-text">
            {title}
          </span>
        </div>

        <button className="flex items-center text-text-3 text-sub-2">
          전체보기
          <ChevronRight direction="right" />
        </button>
      </div>

      <div className="pb-3">
        <p className="text-4xl font-bold text-main-text text-center mb-3 h-[54px]">
          {current}/{total}
        </p>
        <div className="w-full h-8 flex gap-1">
          <div
            className="h-full bg-p-1 rounded-lg shrink-0"
            style={{ width: `${total > 0 ? (current / total) * 100 : 0}%` }}
          />
          <div className="h-full bg-sub-4 rounded-lg flex-1" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-caption-3 font-medium text-sub-1 line-clamp-1">
            {timeText}
          </p>
          {femaleNotice && (
            <p className="text-caption-3 text-p-1 mt-0.5 font-medium line-clamp-1">
              ※ 여학생의 경우 여자 사감선생님께 별도로 신청해주시기 바랍니다.
            </p>
          )}
        </div>
        <TextButton
          variant={visualButtonVariant}
          size="small"
          disabled={!isApplyEnabled}
          onClick={isApplyEnabled ? onApply : undefined}
        >
          {buttonText}
        </TextButton>
      </div>
    </div>
  );
}
