"use client";

import type { StudyBanFilter } from "@/features/self-study/lib/filterManagedStudents";
import { TextButton } from "@/shared/ui/Button/TextButton";

interface StudyBanActionPanelProps {
  selectedStudyBanFilter: StudyBanFilter;
  hasSelectedStudent: boolean;
  isPending: boolean;
  onBanStudent: () => void;
  onUnbanStudent: () => void;
}

export function StudyBanActionPanel({
  selectedStudyBanFilter,
  hasSelectedStudent,
  isPending,
  onBanStudent,
  onUnbanStudent,
}: StudyBanActionPanelProps) {
  const isAllowed = selectedStudyBanFilter === "ALLOWED";
  const isActionEnabled = hasSelectedStudent && !isPending;

  return (
    <div className="flex flex-col gap-[24px]">
      {isAllowed ? (
        <TextButton
          variant={isActionEnabled ? "filled" : "disabled"}
          size="wide"
          onClick={onBanStudent}
        >
          자습 금지
        </TextButton>
      ) : (
        <TextButton
          variant={isActionEnabled ? "outlined" : "disabled"}
          size="wide"
          onClick={onUnbanStudent}
        >
          자습 금지 해제
        </TextButton>
      )}
    </div>
  );
}
