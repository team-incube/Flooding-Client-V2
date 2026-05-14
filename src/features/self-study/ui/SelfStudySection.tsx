"use client";

import { useQuery } from "@tanstack/react-query";
import ApplyStudy from "@/shared/asset/svg/ApplyStudy";
import Search from "@/shared/asset/svg/Search";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { NumberButton } from "@/shared/ui/Button/NumberButton";
import TextField from "@/shared/ui/textField";
import { dormitoryQueries } from "@/entities/dormitory/api/dormitoryQueries";
import { isStudyApplicationTime } from "@/entities/dormitory/lib/applicationTime";
import { userQueries } from "@/entities/user/api/userQueries";
import { createStudyPermission } from "@/entities/user/lib/permission";
import { createApplicationActionState } from "@/shared/lib/applicationActionState";
import { getStudyApplyButtonState } from "../lib/getStudyApplyButtonState";
import { useCurrentTime } from "@/shared/lib/useCurrentTime";
import { useStudyFilter } from "../model/useStudyFilter";
import { useApplyStudy } from "../model/useApplyStudy";
import { useCancelStudy } from "../model/useCancelStudy";
import { useCheckStudyAttendance } from "../model/useCheckStudyAttendance";
import { useStudyAttendanceSubscription } from "../model/useStudyAttendanceSubscription";
import { StudyApplicantCard } from "./StudyApplicantCard";

const GRADE_OPTIONS = [1, 2, 3] as const;
const CLASS_OPTIONS = [1, 2, 3, 4] as const;

export function SelfStudySection() {
  const currentTime = useCurrentTime();
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
  const isStudyBanned = user?.isBanned === true;
  const hasAppliedStudy =
    user !== undefined &&
    students.some((student) => student.userId === user.id);
  const isStudyApplyTime = isStudyApplicationTime(currentTime);
  const studyActionState = createApplicationActionState({
    hasApplied: hasAppliedStudy,
    isUserLoading,
    isDataLoading: isStudyLoading,
    isBanned: isStudyBanned,
    isActionPending: applyMutation.isPending || cancelMutation.isPending,
    isApplicationOpen,
    isApplicationTime: isStudyApplyTime,
  });
  const studyApplyButtonState = getStudyApplyButtonState({
    isStudyBanned,
    isActionDisabled: studyActionState.isActionDisabled,
    isLoading: isUserLoading || isStudyLoading,
    hasApplied: hasAppliedStudy,
    isApplicationOpen,
    isApplicationTime: isStudyApplyTime,
  });
  const studyPermission = createStudyPermission({ role: user?.role });
  const canManageStudy = studyPermission.canManage;
  const { checkedStudentIds, markChecked } = useStudyAttendanceSubscription(
    user?.role,
  );
  const checkAttendanceMutation = useCheckStudyAttendance({
    onChecked: markChecked,
  });

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

  const handleCheckAttendance = (studentId: number) => {
    if (!canManageStudy) {
      return;
    }

    checkAttendanceMutation.mutate(studentId);
  };

  return (
    <section className="bg-background-surface flex flex-col gap-4 rounded-2xl p-6">
      <div className="flex items-end gap-3">
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

      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex max-h-125 flex-wrap gap-4 overflow-y-auto">
            {filteredStudents.map((student, index) => (
              <StudyApplicantCard
                key={student.userId}
                index={index + 1}
                student={student}
                isChecked={
                  student.isChecked === true ||
                  checkedStudentIds.includes(student.userId)
                }
                isPending={
                  checkAttendanceMutation.isPending &&
                  checkAttendanceMutation.variables === student.userId
                }
                canCheck={canManageStudy}
                onCheck={handleCheckAttendance}
              />
            ))}
          </div>
        </div>

        <div className="flex w-[330px] shrink-0 flex-col gap-4">
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
            variant={studyApplyButtonState.variant}
            size="wide"
            disabled={studyActionState.isActionDisabled}
            onClick={hasAppliedStudy ? handleCancelStudy : handleApplyStudy}
          >
            {studyApplyButtonState.text}
          </TextButton>

          <p className="text-sub-2 text-caption-2">
            자습 신청 시간은 20:00 ~ 21:00 입니다
          </p>
        </div>
      </div>
    </section>
  );
}
