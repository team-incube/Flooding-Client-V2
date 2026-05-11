"use client";

import { TextButton } from "@/shared/ui/Button/TextButton";
import type { StudyBanFilter } from "@/features/self-study/lib/filterManagedStudents";

interface StudyBanActionPanelProps {
  selectedStudyBanFilter: StudyBanFilter;
  selectedBanTargetCount: number;
  selectedUnbanTargetCount: number;
  isPending: boolean;
  onBanSelectedStudent: () => void;
  onUnbanSelectedStudent: () => void;
}

export function StudyBanActionPanel({
  selectedStudyBanFilter,
  selectedBanTargetCount,
  selectedUnbanTargetCount,
  isPending,
  onBanSelectedStudent,
  onUnbanSelectedStudent,
}: StudyBanActionPanelProps) {
  if (!selectedStudyBanFilter) {
    return (
      <p className="text-caption-3 text-sub-1 font-medium">
        자습 허용/금지 중 하나를 선택해야 자습 금지/해제가 가능해요.
      </p>
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
      <span className="text-main-text text-text-1">{actionTitle}</span>
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
