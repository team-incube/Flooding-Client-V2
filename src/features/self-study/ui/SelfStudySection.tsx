"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApplyStudy from "@/shared/asset/svg/ApplyStudy";
import Filter from "@/shared/asset/svg/Filter";
import Search from "@/shared/asset/svg/Search";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { NumberButton } from "@/shared/ui/Button/NumberButton";
import TextField from "@/shared/ui/textField";
import { NoteTooltip } from "@/shared/ui/NoteTooltip";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { createApplicationActionState } from "@/entities/dormitory/lib/applicationActionState";
import { createStudyPermission } from "@/entities/dormitory/lib/studyPermission";
import { userQueries } from "@/entities/user/api/userQueries";
import { useStudyFilter } from "../model/useStudyFilter";
import { useApplyStudy } from "../model/useApplyStudy";
import { useCancelStudy } from "../model/useCancelStudy";
import { useCheckStudyAttendance } from "../model/useCheckStudyAttendance";
import { useStudyAttendanceSubscription } from "../model/useStudyAttendanceSubscription";
import { useUncheckStudyAttendance } from "../model/useUncheckStudyAttendance";
import { NoteText } from "@/shared/ui/NoteText";
import { StudyApplicantCard } from "./StudyApplicantCard";
import { StudyFilterModal } from "./StudyFilterModal";

const GRADE_OPTIONS = [1, 2, 3] as const;
const CLASS_OPTIONS = [1, 2, 3, 4] as const;

const STUDY_NOTES = ["※ 자습 신청 시간은 20:00 ~ 21:00 입니다"];

export function SelfStudySection() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const studyQuery = dormitoryQueries.study();
  const { data: studyApplicants, isLoading: isStudyLoading } =
    useQuery(studyQuery);
  const students = studyApplicants?.applicants ?? [];
  const isApplicationOpen = studyApplicants?.isApplicationOpen ?? false;
  const { data: user, isLoading: isUserLoading } = useQuery(userQueries.me());
  const { state, filteredStudents, dispatch } = useStudyFilter(students);
  const { searchQuery, selectedGrades, selectedClasses, selectedGender } =
    state;
  const applyMutation = useApplyStudy();
  const cancelMutation = useCancelStudy();
  const isStudyBanned = studyApplicants?.myApplicationStatus === "BANNED";
  const hasAppliedStudy = studyApplicants?.myApplicationStatus === "APPROVED";
  const isStudyCancelled = studyApplicants?.myApplicationStatus === "CANCELLED";
  const studyActionState = createApplicationActionState({
    hasApplied: hasAppliedStudy,
    isUserLoading,
    isDataLoading: isStudyLoading,
    isBanned: isStudyBanned,
    isCancelled: isStudyCancelled,
    isActionPending: applyMutation.isPending || cancelMutation.isPending,
    isApplicationOpen,
  });
  const studyPermission = createStudyPermission({ role: user?.role });

  useStudyAttendanceSubscription(user?.role);
  const checkAttendanceMutation = useCheckStudyAttendance();
  const uncheckAttendanceMutation = useUncheckStudyAttendance();

  const handleResetFilters = () => dispatch({ type: "RESET" });
  const handleSearchQueryChange = (value: string) =>
    dispatch({ type: "SET_SEARCH", payload: value });
  const handleToggleGrade = (grade: number) =>
    dispatch({ type: "TOGGLE_GRADE", payload: grade });
  const handleToggleClass = (classNumber: number) =>
    dispatch({ type: "TOGGLE_CLASS", payload: classNumber });
  const handleToggleGender = (gender: "MAN" | "WOMAN") =>
    dispatch({
      type: "SET_GENDER",
      payload: selectedGender === gender ? null : gender,
    });
  const handleApplyStudy = () => {
    if (!studyActionState.canApply) {
      return;
    }

    applyMutation.mutate();
  };

  const handleCancelStudy = () => {
    if (!studyActionState.canCancel) {
      return;
    }

    cancelMutation.mutate();
  };

  const handleToggleAttendance = (studentId: number, isChecked: boolean) => {
    if (!studyPermission.canManage) {
      return;
    }

    if (isChecked) {
      uncheckAttendanceMutation.mutate(studentId);
      return;
    }

    checkAttendanceMutation.mutate(studentId);
  };

  return (
    <section
      className="bg-background-surface relative flex flex-col gap-4 rounded-2xl p-5 sm:p-6"
      data-tooltip-card
    >
      {/* 모바일 헤더 */}
      <div className="flex items-center justify-between sm:hidden">
        <div className="flex items-end gap-3">
          <div className="flex items-center gap-2">
            <ApplyStudy />
            <span className="text-main-text text-text-1">자습신청</span>
            <NoteTooltip notes={STUDY_NOTES} ariaLabel="자습신청 안내 보기" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sub-1 text-caption-1">신청인</span>
            <span className="text-p-1 text-caption-1">
              {filteredStudents.length}명
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className="flex size-9 cursor-pointer items-center justify-center"
          aria-label="필터"
        >
          <Filter size={24} />
        </button>
      </div>

      {/* 데스크탑 헤더 */}
      <div className="hidden items-end gap-3 sm:flex">
        <div className="flex items-center gap-1">
          <ApplyStudy />
          <span className="text-main-text text-text-1">자습신청</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-caption-1">신청인</span>
          <span className="text-p-1 text-caption-1">
            {filteredStudents.length}명
          </span>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-stretch">
        <div className="relative min-w-0 flex-1 sm:min-h-0 sm:overflow-hidden">
          <div className="scrollbar-hide flex max-h-125 flex-wrap gap-4 overflow-y-auto sm:absolute sm:inset-0 sm:max-h-none sm:content-start sm:pr-1">
            {filteredStudents.map((student, index) => (
              <StudyApplicantCard
                key={student.userId}
                index={index + 1}
                student={student}
                isChecked={student.isChecked}
                isPending={
                  (checkAttendanceMutation.isPending &&
                    checkAttendanceMutation.variables === student.userId) ||
                  (uncheckAttendanceMutation.isPending &&
                    uncheckAttendanceMutation.variables === student.userId)
                }
                canCheck={studyPermission.canManage}
                onToggleCheck={handleToggleAttendance}
              />
            ))}
          </div>
        </div>

        {/* 필터 패널: 데스크탑에서만 표시 */}
        <div className="hidden w-full flex-col gap-4 sm:flex sm:w-82.5 sm:shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-main-text text-text-2">필터</span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sub-1 text-caption-2 hover:text-p-1 cursor-pointer"
            >
              초기화
            </button>
          </div>

          <TextField
            placeholder="학생 이름, 학번을 입력해주세요"
            value={searchQuery}
            onChange={(e) => handleSearchQueryChange(e.target.value)}
            rightIcon={<Search />}
          />

          <div className="flex flex-col gap-2">
            <span className="text-sub-1 text-caption-1">학년</span>
            <div className="flex gap-2">
              {GRADE_OPTIONS.map((grade) => (
                <NumberButton
                  key={grade}
                  variant={
                    selectedGrades.includes(grade) ? "filled" : "outlined"
                  }
                  onClick={() => handleToggleGrade(grade)}
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
                  onClick={() => handleToggleClass(classNumber)}
                >
                  {classNumber}
                </NumberButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sub-1 text-caption-1">성별</span>
            <div className="flex gap-2">
              <TextButton
                variant={selectedGender === "MAN" ? "filled" : "outlined"}
                size="small"
                onClick={() => handleToggleGender("MAN")}
              >
                남자
              </TextButton>
              <TextButton
                variant={selectedGender === "WOMAN" ? "filled" : "outlined"}
                size="small"
                onClick={() => handleToggleGender("WOMAN")}
              >
                여자
              </TextButton>
            </div>
          </div>

          <div className="flex-1" />

          <TextButton
            variant={
              isStudyBanned
                ? "negative"
                : studyActionState.isActionDisabled
                  ? "disabled"
                  : "filled"
            }
            size="wide"
            className="w-full"
            disabled={studyActionState.isActionDisabled}
            onClick={hasAppliedStudy ? handleCancelStudy : handleApplyStudy}
          >
            {isStudyBanned
              ? "자습 금지를 당했어요!"
              : isUserLoading || isStudyLoading
                ? "확인 중"
                : hasAppliedStudy
                  ? "취소하기"
                  : studyActionState.isApplyDisabled
                    ? "신청 불가"
                    : "신청하기"}
          </TextButton>

          <div className="flex min-w-0 flex-col gap-0.5">
            <NoteText>※ 자습 신청 시간은 20:00 ~ 21:00 입니다</NoteText>
            {studyPermission.canCheckAttendance && (
              <NoteText>
                ※ 학생 카드의 체크박스를 눌러 출석 체크가 가능해요
              </NoteText>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 신청 버튼 */}
      <div className="sm:hidden">
        <TextButton
          variant={
            isStudyBanned
              ? "negative"
              : studyActionState.isActionDisabled
                ? "disabled"
                : "filled"
          }
          size="wide"
          className="w-full"
          disabled={studyActionState.isActionDisabled}
          onClick={hasAppliedStudy ? handleCancelStudy : handleApplyStudy}
        >
          {isStudyBanned
            ? "자습 금지를 당했어요!"
            : isUserLoading || isStudyLoading
              ? "확인 중"
              : hasAppliedStudy
                ? "취소하기"
                : studyActionState.isApplyDisabled
                  ? "신청 불가"
                  : "신청하기"}
        </TextButton>
      </div>

      <StudyFilterModal
        isOpen={isFilterOpen}
        selectedGrades={selectedGrades}
        selectedClasses={selectedClasses}
        selectedGender={selectedGender}
        onClose={() => setIsFilterOpen(false)}
        onReset={handleResetFilters}
        onToggleGrade={handleToggleGrade}
        onToggleClass={handleToggleClass}
        onToggleGender={handleToggleGender}
      />
    </section>
  );
}
