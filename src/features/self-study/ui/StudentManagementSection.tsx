"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userQueries } from "@/entities/user/api/userQueries";
import Student from "@/shared/asset/svg/Student";
import {
  filterManagedStudents,
  type StudyBanFilter,
} from "@/features/self-study/lib/filterManagedStudents";
import { useBanStudy } from "@/features/self-study/model/useBanStudy";
import { ManagedStudentCard } from "./ManagedStudentCard";
import { StudentManagementFilterPanel } from "./StudentManagementFilterPanel";
import { StudyBanActionPanel } from "./StudyBanActionPanel";

export function StudentManagementSection() {
  const { data: studentPage, isLoading, isError } = useQuery(userQueries.list());
  const banStudyMutation = useBanStudy();
  const [optimisticBannedStudentIds, setOptimisticBannedStudentIds] = useState<
    number[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedStudyBanFilter, setSelectedStudyBanFilter] =
    useState<StudyBanFilter>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const students = studentPage?.content ?? [];
  const optimisticBannedStudentIdSet = new Set(optimisticBannedStudentIds);
  const bannedStudentIdSet = new Set(
    students
      .filter(({ isBanned }) => isBanned)
      .map(({ id }) => id),
  );

  const filteredStudents = filterManagedStudents({
    students,
    searchQuery,
    selectedGrades,
    selectedClasses,
    selectedStudyBanFilter,
    bannedStudentIds: optimisticBannedStudentIds,
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGrades([]);
    setSelectedClasses([]);
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

  const isStudyBanned = (studentId: number) => {
    return (
      bannedStudentIdSet.has(studentId) ||
      optimisticBannedStudentIdSet.has(studentId)
    );
  };

  const handleBanSelectedStudent = () => {
    const targetStudentIds = selectedStudentIds.filter(
      (studentId) => !isStudyBanned(studentId),
    );

    if (targetStudentIds.length === 0) {
      return;
    }

    banStudyMutation.mutate(targetStudentIds, {
      onSuccess: ({ successfulStudentIds }) => {
        setOptimisticBannedStudentIds((prev) => [
          ...new Set([...prev, ...successfulStudentIds]),
        ]);
        setSelectedStudentIds([]);
      },
    });
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
            {isLoading && (
              <span className="text-text-3 text-sub-1">
                학생 목록을 불러오는 중입니다.
              </span>
            )}
            {isError && (
              <span className="text-text-3 text-negative">
                학생 목록을 불러오지 못했습니다.
              </span>
            )}
            {!isLoading &&
              !isError &&
              filteredStudents.map((student, index) => (
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
          <StudentManagementFilterPanel
            searchQuery={searchQuery}
            selectedGrades={selectedGrades}
            selectedClasses={selectedClasses}
            selectedStudyBanFilter={selectedStudyBanFilter}
            onResetFilters={handleResetFilters}
            onSearchQueryChange={setSearchQuery}
            onToggleGrade={handleToggleGrade}
            onToggleClass={handleToggleClass}
            onToggleStudyBanFilter={handleToggleStudyBanFilter}
          />

          <StudyBanActionPanel
            selectedBanTargetCount={selectedBanTargetCount}
            isPending={banStudyMutation.isPending}
            onClearSelection={() => setSelectedStudentIds([])}
            onBanSelectedStudent={handleBanSelectedStudent}
          />
        </aside>
      </div>
    </section>
  );
}
