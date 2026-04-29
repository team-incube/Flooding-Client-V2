"use client";

import type { StudyBanFilter } from "@/features/self-study/lib/filterManagedStudents";
import Search from "@/shared/asset/svg/Search";
import { NumberButton } from "@/shared/ui/Button/NumberButton";
import { TextButton } from "@/shared/ui/Button/TextButton";
import TextField from "@/shared/ui/textField";

const GRADE_OPTIONS = [1, 2, 3] as const;
const CLASS_OPTIONS = [1, 2, 3, 4] as const;

const studyBanLabels = {
  ALLOWED: "허용",
  BANNED: "금지",
} as const;

interface StudentManagementFilterPanelProps {
  searchQuery: string;
  selectedGrades: number[];
  selectedClasses: number[];
  selectedStudyBanFilter: StudyBanFilter;
  onResetFilters: () => void;
  onSearchQueryChange: (value: string) => void;
  onToggleGrade: (grade: number) => void;
  onToggleClass: (classNumber: number) => void;
  onToggleStudyBanFilter: (filter: Exclude<StudyBanFilter, null>) => void;
}

export function StudentManagementFilterPanel({
  searchQuery,
  selectedGrades,
  selectedClasses,
  selectedStudyBanFilter,
  onResetFilters,
  onSearchQueryChange,
  onToggleGrade,
  onToggleClass,
  onToggleStudyBanFilter,
}: StudentManagementFilterPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <span className="text-main-text text-text-1">필터</span>
          <button
            type="button"
            onClick={onResetFilters}
            className="cursor-pointer text-text-4 text-sub-1 transition-colors hover:text-p-1"
          >
            초기화
          </button>
        </div>
        <TextField
          placeholder="학생 이름, 학번을 입력해주세요"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          rightIcon={<Search />}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-main-text text-text-3">학년</span>
        <div className="flex gap-2">
          {GRADE_OPTIONS.map((grade) => (
            <NumberButton
              key={grade}
              variant={selectedGrades.includes(grade) ? "filled" : "outlined"}
              onClick={() => onToggleGrade(grade)}
            >
              {grade}
            </NumberButton>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-main-text text-text-3">반</span>
        <div className="flex gap-2">
          {CLASS_OPTIONS.map((classNumber) => (
            <NumberButton
              key={classNumber}
              variant={
                selectedClasses.includes(classNumber) ? "filled" : "outlined"
              }
              onClick={() => onToggleClass(classNumber)}
            >
              {classNumber}
            </NumberButton>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-main-text text-text-3">자습</span>
        <div className="flex gap-2">
          {Object.entries(studyBanLabels).map(([filter, label]) => (
            <TextButton
              key={filter}
              variant={
                selectedStudyBanFilter === filter ? "filled" : "outlined"
              }
              size="small"
              className="h-[34px]! w-14!"
              onClick={() =>
                onToggleStudyBanFilter(
                  filter as Exclude<StudyBanFilter, null>,
                )
              }
            >
              {label}
            </TextButton>
          ))}
        </div>
      </div>
    </div>
  );
}
