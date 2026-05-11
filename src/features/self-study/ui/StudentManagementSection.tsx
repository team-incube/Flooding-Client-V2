"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueries } from "@/entities/user/api/userQueries";
import type { Sex } from "@/entities/user/model/user";
import Student from "@/shared/asset/svg/Student";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";
import { TextButton } from "@/shared/ui/Button/TextButton";
import type { QueryErrorFallbackProps } from "@/shared/ui/QueryErrorBoundary";
import { Skeleton } from "@/shared/ui/Skeleton";
import {
  filterManagedStudents,
  type StudyBanFilter,
} from "@/features/self-study/lib/filterManagedStudents";
import { useBanStudy } from "@/features/self-study/model/useBanStudy";
import { useUnbanStudy } from "@/features/self-study/model/useUnbanStudy";
import { ManagedStudentCard } from "./ManagedStudentCard";
import { StudentManagementFilterPanel } from "./StudentManagementFilterPanel";
import { StudyBanActionPanel } from "./StudyBanActionPanel";

const SEARCH_DEBOUNCE_DELAY = 300;

function StudentManagementSectionLoading() {
  return (
    <section className="bg-background-surface flex flex-col gap-4 rounded-2xl p-6 shadow-[0_0_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-end gap-3">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex max-h-[773px] flex-wrap gap-4 overflow-hidden pr-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-[88px] w-[180px] rounded-xl" />
            ))}
          </div>
        </div>
        <aside className="hidden w-[330px] shrink-0 flex-col gap-[60px] lg:flex">
          <Skeleton className="h-[360px] w-full rounded-xl" />
          <Skeleton className="h-[120px] w-full rounded-xl" />
        </aside>
      </div>
    </section>
  );
}

function StudentManagementSectionError({
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  return (
    <section className="bg-background-surface flex h-[520px] flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-[0_0_12px_rgba(0,0,0,0.04)]">
      <Student isActive />
      <p className="text-text-1 text-main-text">
        학생 목록을 불러오지 못했습니다.
      </p>
      <TextButton variant="outlined" size="fit" onClick={resetErrorBoundary}>
        다시 시도
      </TextButton>
    </section>
  );
}

function StudentManagementSectionEmpty() {
  return (
    <div className="flex h-[320px] w-full items-center justify-center">
      <p className="text-text-2 text-sub-1">표시할 학생이 없습니다.</p>
    </div>
  );
}

const StudentManagementSection = () => {
  const { data: studentPage } = useSuspenseQuery(userQueries.list());
  const banStudyMutation = useBanStudy();
  const unbanStudyMutation = useUnbanStudy();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(
    searchQuery,
    SEARCH_DEBOUNCE_DELAY,
  );
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedGender, setSelectedGender] = useState<Sex | null>(null);
  const [selectedStudyBanFilter, setSelectedStudyBanFilter] =
    useState<StudyBanFilter>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const students = studentPage?.content ?? [];
  const bannedStudentIdSet = new Set(
    students.filter(({ isBanned }) => isBanned).map(({ id }) => id),
  );

  const filteredStudents = filterManagedStudents({
    students,
    searchQuery: debouncedSearchQuery,
    selectedGrades,
    selectedClasses,
    selectedGender,
    selectedStudyBanFilter,
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGrades([]);
    setSelectedClasses([]);
    setSelectedGender(null);
    setSelectedStudyBanFilter(null);
  };

  const toggleNumberFilter = (
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

  const handleToggleGrade = (grade: number) => {
    toggleNumberFilter(grade, selectedGrades, setSelectedGrades);
  };

  const handleToggleClass = (classNumber: number) => {
    toggleNumberFilter(classNumber, selectedClasses, setSelectedClasses);
  };

  const handleToggleGender = (gender: Sex) => {
    setSelectedGender((prev) => (prev === gender ? null : gender));
  };

  const handleToggleStudyBanFilter = (
    filter: Exclude<StudyBanFilter, null>,
  ) => {
    setSelectedStudyBanFilter((prev) => (prev === filter ? null : filter));
    setSelectedStudentIds([]);
  };

  const handleToggleStudentSelect = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((selectedStudentId) => selectedStudentId !== studentId)
        : [...prev, studentId],
    );
  };

  const isStudyBanned = (studentId: number) =>
    bannedStudentIdSet.has(studentId);

  const getSelectedBanTargetIds = () =>
    selectedStudentIds.filter(
      (studentId) => !isStudyBanned(studentId),
    );

  const getSelectedUnbanTargetIds = () =>
    selectedStudentIds.filter(isStudyBanned);

  const handleBanSelectedStudent = () => {
    const targetStudentIds = getSelectedBanTargetIds();

    if (targetStudentIds.length === 0) {
      return;
    }

    setSelectedStudentIds([]);
    banStudyMutation.mutate(targetStudentIds);
  };

  const handleUnbanSelectedStudent = () => {
    const targetStudentIds = getSelectedUnbanTargetIds();

    if (targetStudentIds.length === 0) {
      return;
    }

    setSelectedStudentIds([]);
    unbanStudyMutation.mutate(targetStudentIds);
  };

  const selectedBanTargetCount = getSelectedBanTargetIds().length;
  const selectedUnbanTargetCount =
    selectedStudentIds.length - selectedBanTargetCount;
  const isStudyBanActionPending =
    banStudyMutation.isPending || unbanStudyMutation.isPending;

  return (
    <section className="bg-background-surface flex flex-col gap-4 rounded-2xl p-6 shadow-[0_0_12px_rgba(0,0,0,0.04)]">
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
            {filteredStudents.length === 0 ? (
              <StudentManagementSection.Empty />
            ) : (
              filteredStudents.map((student, index) => (
                <ManagedStudentCard
                  key={student.id}
                  index={index + 1}
                  student={student}
                  isSelected={selectedStudentIds.includes(student.id)}
                  onToggleSelect={handleToggleStudentSelect}
                />
              ))
            )}
          </div>
        </div>

        <aside className="flex w-[330px] shrink-0 flex-col gap-[60px]">
          <StudentManagementFilterPanel
            searchQuery={searchQuery}
            selectedGrades={selectedGrades}
            selectedClasses={selectedClasses}
            selectedGender={selectedGender}
            selectedStudyBanFilter={selectedStudyBanFilter}
            onResetFilters={handleResetFilters}
            onSearchQueryChange={setSearchQuery}
            onToggleGrade={handleToggleGrade}
            onToggleClass={handleToggleClass}
            onToggleGender={handleToggleGender}
            onToggleStudyBanFilter={handleToggleStudyBanFilter}
          />

          <StudyBanActionPanel
            selectedStudyBanFilter={selectedStudyBanFilter}
            selectedBanTargetCount={selectedBanTargetCount}
            selectedUnbanTargetCount={selectedUnbanTargetCount}
            isPending={isStudyBanActionPending}
            onBanSelectedStudent={handleBanSelectedStudent}
            onUnbanSelectedStudent={handleUnbanSelectedStudent}
          />
        </aside>
      </div>
    </section>
  );
};

StudentManagementSection.Loading = StudentManagementSectionLoading;
StudentManagementSection.Error = StudentManagementSectionError;
StudentManagementSection.Empty = StudentManagementSectionEmpty;

export { StudentManagementSection };
