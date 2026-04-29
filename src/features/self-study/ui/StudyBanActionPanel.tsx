"use client";

import { TextButton } from "@/shared/ui/Button/TextButton";

interface StudyBanActionPanelProps {
  selectedBanTargetCount: number;
  isPending: boolean;
  onClearSelection: () => void;
  onBanSelectedStudent: () => void;
}

export function StudyBanActionPanel({
  selectedBanTargetCount,
  isPending,
  onClearSelection,
  onBanSelectedStudent,
}: StudyBanActionPanelProps) {
  return (
    <div className="flex flex-col gap-[35px]">
      <div className="flex items-end justify-between">
        <span className="text-main-text text-text-1">자습 금지</span>
        <button
          type="button"
          onClick={onClearSelection}
          className="cursor-pointer text-text-4 text-sub-1 transition-colors hover:text-p-1"
        >
          선택 해제
        </button>
      </div>
      <TextButton
        variant={selectedBanTargetCount > 0 && !isPending ? "filled" : "disabled"}
        size="wide"
        onClick={onBanSelectedStudent}
      >
        금지 시키기
      </TextButton>
    </div>
  );
}
