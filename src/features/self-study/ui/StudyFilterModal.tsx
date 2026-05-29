"use client";

import { TextButton } from "@/shared/ui/Button/TextButton";
import { NumberButton } from "@/shared/ui/Button/NumberButton";

const GRADE_OPTIONS = [1, 2, 3] as const;
const CLASS_OPTIONS = [1, 2, 3, 4] as const;

export interface StudyFilterModalProps {
  isOpen: boolean;
  selectedGrades: number[];
  selectedClasses: number[];
  selectedGender: "MAN" | "WOMAN" | null;
  onClose: () => void;
  onReset: () => void;
  onToggleGrade: (grade: number) => void;
  onToggleClass: (classNumber: number) => void;
  onToggleGender: (gender: "MAN" | "WOMAN") => void;
}

export function StudyFilterModal({
  isOpen,
  selectedGrades,
  selectedClasses,
  selectedGender,
  onClose,
  onReset,
  onToggleGrade,
  onToggleClass,
  onToggleGender,
}: StudyFilterModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 px-5"
      onClick={onClose}
    >
      <div
          className="bg-background-surface flex w-full flex-col gap-4 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-main-text text-text-1 font-semibold">
              필터
            </span>
            <button
              type="button"
              onClick={onReset}
              className="text-sub-1 text-caption-2 hover:text-p-1 cursor-pointer"
            >
              초기화
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sub-1 text-caption-1">학년</span>
            <div className="flex gap-2">
              {GRADE_OPTIONS.map((grade) => (
                <NumberButton
                  key={grade}
                  variant={
                    selectedGrades.includes(grade) ? "filled" : "outlined"
                  }
                  onClick={() => onToggleGrade(grade)}
                >
                  {grade}
                </NumberButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sub-1 text-caption-1">반</span>
            <div className="flex gap-2">
              {CLASS_OPTIONS.map((classNumber) => (
                <NumberButton
                  key={classNumber}
                  variant={
                    selectedClasses.includes(classNumber)
                      ? "filled"
                      : "outlined"
                  }
                  onClick={() => onToggleClass(classNumber)}
                >
                  {classNumber}
                </NumberButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sub-1 text-caption-1">성별</span>
            <div className="flex gap-2">
              <NumberButton
                variant={selectedGender === "MAN" ? "filled" : "outlined"}
                onClick={() => onToggleGender("MAN")}
              >
                남자
              </NumberButton>
              <NumberButton
                variant={selectedGender === "WOMAN" ? "filled" : "outlined"}
                onClick={() => onToggleGender("WOMAN")}
              >
                여자
              </NumberButton>
            </div>
          </div>

          <div className="flex gap-3">
            <TextButton
              variant="outlined"
              size="wide"
              className="flex-1"
              onClick={onClose}
            >
              뒤로가기
            </TextButton>
            <TextButton
              variant="filled"
              size="wide"
              className="flex-1"
              onClick={onClose}
            >
              적용
            </TextButton>
          </div>
      </div>
    </div>
  );
}
