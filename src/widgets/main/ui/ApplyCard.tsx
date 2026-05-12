import Link from "next/link";
import ChevronRight from "@/shared/asset/svg/Back";
import { TextButton } from "@/shared/ui/Button/TextButton";
import type { TextButtonVariant } from "@/shared/ui/Button/TextButton";

type ApplyCardButtonSize = "small" | "fit";

interface ApplyCardProps {
  title: string;
  icon: React.ReactNode;
  current: number;
  total: number;
  timeText: string;
  buttonText: string;
  buttonVariant?: TextButtonVariant;
  buttonSize?: ApplyCardButtonSize;
  detailHref?: string;
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
  buttonSize = "small",
  detailHref,
  disabled = false,
  femaleNotice = false,
  onApply,
}: ApplyCardProps) {
  const isApplyEnabled = !disabled;
  const visualButtonVariant =
    disabled && buttonVariant === "filled" ? "disabled" : buttonVariant;

  return (
    <div className="bg-background-surface w-full rounded-2xl p-6">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-1">
          <div>{icon}</div>
          <span className="text-text-1 text-main-text font-semibold">
            {title}
          </span>
        </div>

        {detailHref && (
          <Link
            href={detailHref}
            className="text-text-3 text-sub-2 hover:text-p-1 flex items-center"
          >
            전체보기
            <ChevronRight direction="right" />
          </Link>
        )}
      </div>

      <div className="pb-3">
        <p className="text-main-text mb-3 h-[54px] text-center text-4xl font-bold">
          {current}/{total}
        </p>
        <div className="flex h-8 w-full gap-1">
          <div
            className="bg-p-1 h-full shrink-0 rounded-lg"
            style={{ width: `${total > 0 ? (current / total) * 100 : 0}%` }}
          />
          <div className="bg-sub-4 h-full flex-1 rounded-lg" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption-3 text-sub-1 line-clamp-1 font-medium">
            {timeText}
          </p>
          {femaleNotice && (
            <p className="text-caption-3 text-p-1 mt-0.5 line-clamp-1 font-medium">
              ※ 여학생의 경우 여자 사감선생님께 별도로 신청해주시기 바랍니다.
            </p>
          )}
        </div>
        <TextButton
          variant={visualButtonVariant}
          size={buttonSize}
          disabled={!isApplyEnabled}
          onClick={isApplyEnabled ? onApply : undefined}
        >
          {buttonText}
        </TextButton>
      </div>
    </div>
  );
}
