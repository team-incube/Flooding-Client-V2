"use client";

import { useState } from "react";
import Link from "next/link";
import ChevronRight from "@/shared/asset/svg/Back";
import Exclamation from "@/shared/asset/svg/Exclamation";
import { TextButton } from "@/shared/ui/Button/TextButton";
import type { TextButtonVariant } from "@/shared/ui/Button/TextButton";
import { NoteText } from "@/shared/ui/NoteText";

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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isApplyEnabled = !disabled;
  const visualButtonVariant =
    disabled && buttonVariant === "filled" ? "disabled" : buttonVariant;
  const tooltipText = timeText.replace(/^※ /, "");

  const handleToggleTooltip = () => setIsTooltipOpen((prev) => !prev);

  return (
    <div className="bg-background-surface relative w-full rounded-2xl p-5 sm:p-6">
      {isTooltipOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsTooltipOpen(false)}
          />
          <div className="bg-main-text absolute bottom-full left-0 z-50 flex h-8.5 w-max items-center justify-center rounded-xl px-4 sm:hidden">
            <p className="text-sub-4 text-[13px] font-medium whitespace-nowrap">
              {tooltipText}
            </p>
            <div className="bg-main-text absolute -bottom-1.5 left-31.5 h-3 w-3 -translate-x-1/2 rotate-45" />
          </div>
        </>
      )}

      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <div>{icon}</div>
          <span className="text-text-1 text-main-text font-semibold">
            {title}
          </span>
          <button
            type="button"
            onClick={handleToggleTooltip}
            className="bg-sub-3 flex h-4.5 w-4.5 shrink-0 cursor-pointer items-center justify-center rounded-full sm:hidden"
            aria-label="신청 시간 안내"
          >
            <Exclamation size={10} />
          </button>
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
        <p className="text-main-text mb-2 h-11 text-center text-3xl font-bold sm:mb-3 sm:h-13.5 sm:text-4xl">
          {current}/{total}
        </p>
        <div className="flex h-6 w-full gap-1 sm:h-8">
          <div
            className="bg-p-1 h-full shrink-0 rounded-lg"
            style={{ width: `${total > 0 ? (current / total) * 100 : 0}%` }}
          />
          <div className="bg-sub-4 h-full flex-1 rounded-lg" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        {femaleNotice ? (
          <div className="min-w-0">
            <NoteText tone="primary" className="line-clamp-1">
              여학생의 경우 여자 사감선생님께 별도로 신청해주시기 바랍니다.
            </NoteText>
          </div>
        ) : (
          <div />
        )}
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
