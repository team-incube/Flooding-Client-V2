"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { User, Sex } from "@/entities/user/model/user";
import { MOCK_STUDENTS } from "@/entities/user/model/mock";
import Gender from "@/shared/asset/svg/Gender";
import Profile from "@/shared/asset/svg/Profile";
import Search from "@/shared/asset/svg/Search";
import Student from "@/shared/asset/svg/Student";
import Checkbox from "@/shared/asset/svg/Checkbox";
import TextField from "@/shared/ui/textField";
import { NumberButton } from "@/shared/ui/Button/NumberButton";
import { TextButton } from "@/shared/ui/Button/TextButton";
import {
  filterManagedStudents,
  type StudyBanFilter,
} from "@/features/self-study/lib/filterManagedStudents";
import { useStudyBanMockState } from "@/features/self-study/model/useStudyBanMockState";

const GRADE_OPTIONS = [1, 2, 3] as const;
const CLASS_OPTIONS = [1, 2, 3, 4] as const;

const studyBanLabels = {
  ALLOWED: "허용",
  BANNED: "금지",
} as const;

interface ManagedStudentCardProps {
  index: number;
  student: User;
  isSelected: boolean;
  onToggleSelect: (studentId: number) => void;
}

function ManagedStudentCard({
  index,
  student,
  isSelected,
  onToggleSelect,
}: ManagedStudentCardProps) {
  const cardStyles = isSelected
    ? "bg-p-2 ring-2 ring-p-1"
    : "bg-sub-4 hover:bg-p-2";

  return (
    <div
      className={`relative h-[165px] w-[170px] shrink-0 rounded-2xl p-4 transition-colors ${cardStyles}`}
    >
      <span className="absolute top-4 left-4 text-caption-3 text-sub-1">
        {index}
      </span>
      <button
        type="button"
        aria-label={`${student.name} 선택`}
        aria-pressed={isSelected}
        onClick={() => onToggleSelect(student.id)}
        className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-background-surface"
      >
        <Checkbox isActive={isSelected} />
      </button>
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div className="flex h-[64px] w-[64px] items-center justify-center">
          <Profile />
        </div>
        <div className="flex items-center">
          <span className="text-text-3 text-main-text">{student.name}</span>
          <Gender
            isActive={student.sex === "WOMAN"}
            size={16}
            color="var(--color-main-text)"
          />
        </div>
        <span className="text-caption-1 text-sub-1">
          {student.studentNumber}
        </span>
      </div>
    </div>
  );
}

export function StudentManagementSection() {
  const { bannedStudentIds, banStudents, resetBannedStudents, isStudyBanned } =
    useStudyBanMockState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedGender, setSelectedGender] = useState<Sex | null>(null);
  const [selectedStudyBanFilter, setSelectedStudyBanFilter] =
    useState<StudyBanFilter>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const filteredStudents = filterManagedStudents({
    students: MOCK_STUDENTS,
    searchQuery,
    selectedGrades,
    selectedClasses,
    selectedGender,
    selectedStudyBanFilter,
    bannedStudentIds,
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGrades([]);
    setSelectedClasses([]);
    setSelectedGender(null);
    setSelectedStudyBanFilter(null);
  };

  const handleToggleNumberFilter = (
    value: number,
    selectedValues: number[],
    setSelectedValues: (values: number[]) => void,
  ) => {
    setSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter((selectedValue) => selectedValue !== value)
        : [...selectedValues, value],
    );
  };

  const handleToggleGender = (gender: Sex) => {
    setSelectedGender((prev) => (prev === gender ? null : gender));
  };

  const handleToggleStudyBanFilter = (
    filter: Exclude<StudyBanFilter, null>,
  ) => {
    setSelectedStudyBanFilter((prev) => (prev === filter ? null : filter));
  };

  const handleToggleStudentSelect = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((selectedStudentId) => selectedStudentId !== studentId)
        : [...prev, studentId],
    );
  };

  const handleBanSelectedStudent = () => {
    const targetStudentIds = selectedStudentIds.filter(
      (studentId) => !isStudyBanned(studentId),
    );

    if (targetStudentIds.length === 0) {
      return;
    }

    banStudents(targetStudentIds);
    setSelectedStudentIds([]);
    toast.success(
      `${targetStudentIds.length}명을 자습 금지 상태로 표시했어요.`,
    );
  };

  const handleResetBannedStudents = () => {
    resetBannedStudents();
    setSelectedStudentIds([]);
  };

  const selectedBanTargetCount = selectedStudentIds.filter(
    (studentId) => !isStudyBanned(studentId),
  ).length;

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-background-surface p-6 shadow-[0_0_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-end gap-3">
        <div className="flex items-center gap-1">
          <Student isActive />
          <span className="text-main-text text-title-3">학생관리</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-text-4">학생 수</span>
          <span className="text-p-1 text-text-4">
            {filteredStudents.length}명
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex max-h-[773px] flex-wrap gap-4 overflow-y-auto pr-2">
            {filteredStudents.map((student, index) => (
              <ManagedStudentCard
                key={student.id}
                index={index + 1}
                student={student}
                isSelected={selectedStudentIds.includes(student.id)}
                onToggleSelect={handleToggleStudentSelect}
              />
            ))}
          </div>
        </div>

        <aside className="flex w-[330px] shrink-0 flex-col gap-[60px]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <span className="text-main-text text-text-1">필터</span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="cursor-pointer text-text-4 text-sub-1 transition-colors hover:text-p-1"
                >
                  초기화
                </button>
              </div>
              <TextField
                placeholder="학생 이름, 학번을 입력해주세요"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                rightIcon={<Search />}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-main-text text-text-3">학년</span>
              <div className="flex gap-2">
                {GRADE_OPTIONS.map((grade) => (
                  <NumberButton
                    key={grade}
                    variant={
                      selectedGrades.includes(grade) ? "filled" : "outlined"
                    }
                    onClick={() =>
                      handleToggleNumberFilter(
                        grade,
                        selectedGrades,
                        setSelectedGrades,
                      )
                    }
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
                      selectedClasses.includes(classNumber)
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() =>
                      handleToggleNumberFilter(
                        classNumber,
                        selectedClasses,
                        setSelectedClasses,
                      )
                    }
                  >
                    {classNumber}
                  </NumberButton>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-main-text text-text-3">성별</span>
              <div className="flex gap-2">
                <TextButton
                  variant={selectedGender === "MAN" ? "filled" : "outlined"}
                  size="small"
                  className="h-[34px]! w-14!"
                  onClick={() => handleToggleGender("MAN")}
                >
                  남자
                </TextButton>
                <TextButton
                  variant={selectedGender === "WOMAN" ? "filled" : "outlined"}
                  size="small"
                  className="h-[34px]! w-14!"
                  onClick={() => handleToggleGender("WOMAN")}
                >
                  여자
                </TextButton>
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
                      handleToggleStudyBanFilter(
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

          <div className="flex flex-col gap-[35px]">
            <div className="flex items-end justify-between">
              <span className="text-main-text text-text-1">자습 금지</span>
              <button
                type="button"
                onClick={handleResetBannedStudents}
                className="cursor-pointer text-text-4 text-sub-1 transition-colors hover:text-p-1"
              >
                초기화
              </button>
            </div>
            <TextButton
              variant={selectedBanTargetCount > 0 ? "filled" : "disabled"}
              size="wide"
              onClick={handleBanSelectedStudent}
            >
              금지 시키기
            </TextButton>
          </div>
        </aside>
      </div>
    </section>
  );
}
