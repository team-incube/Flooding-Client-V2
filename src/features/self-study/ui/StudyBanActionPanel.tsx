"use client";

import { TextButton } from "@/shared/ui/Button/TextButton";
import { NoteText } from "@/shared/ui/NoteText";
import type { StudyBanFilter } from "@/features/self-study/lib/filterManagedStudents";

interface StudyBanActionPanelProps {
  selectedStudyBanFilter: StudyBanFilter;
  selectedBanTargetCount: number;
  selectedUnbanTargetCount: number;
  isPending: boolean;
  onClearSelection: () => void;
  onBanSelectedStudent: () => void;
  onUnbanSelectedStudent: () => void;
}

export function StudyBanActionPanel({
  selectedStudyBanFilter,
  selectedBanTargetCount,
  selectedUnbanTargetCount,
  isPending,
  onClearSelection,
  onBanSelectedStudent,
  onUnbanSelectedStudent,
}: StudyBanActionPanelProps) {
  if (!selectedStudyBanFilter) {
    return (
      <NoteText>
        자습 허용/금지 중 하나를 선택해야 자습 금지/해제가 가능해요.
      </NoteText>
    );
  }

  const isAllowedFilterSelected = selectedStudyBanFilter === "ALLOWED";
  const canBan = selectedBanTargetCount > 0;
  const canUnban = selectedUnbanTargetCount > 0;
  const actionTitle = isAllowedFilterSelected ? "자습 금지" : "자습 금지 해제";
  const isActionEnabled =
    !isPending && (isAllowedFilterSelected ? canBan : canUnban);

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex items-end justify-between">
        <span className="text-main-text text-text-1">{actionTitle}</span>
        <button
          type="button"
          onClick={onClearSelection}
          className="text-text-4 text-sub-1 hover:text-p-1 cursor-pointer"
        >
          선택 해제
        </button>
      </div>
      {isAllowedFilterSelected ? (
        <TextButton
          variant={isActionEnabled ? "filled" : "disabled"}
          size="wide"
          onClick={onBanSelectedStudent}
        >
          자습 금지
        </TextButton>
      ) : (
        <TextButton
          variant={isActionEnabled ? "outlined" : "disabled"}
          size="wide"
          onClick={onUnbanSelectedStudent}
        >
          자습 금지 해제
        </TextButton>
      )}
    </div>
  );
}
