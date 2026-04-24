"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";
import ApplyStudy from "@/shared/asset/svg/ApplyStudy";
import Search from "@/shared/asset/svg/Search";
import { ProfileCard } from "@/entities/user/ui/ProfileCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { NumberButton } from "@/shared/ui/Button/NumberButton";
import TextField from "@/shared/ui/textField";
import {
  dormitoryQueries,
  dormitoryMutations,
} from "@/entities/dormitory/api/dormitoryQueries";
import { useStudyFilter } from "../model/useStudyFilter";

const GRADE_OPTIONS = [1, 2, 3] as const;
const CLASS_OPTIONS = [1, 2, 3, 4] as const;

export function SelfStudySection() {
  const queryClient = useQueryClient();
  const studyQuery = dormitoryQueries.study();
  const { data: students = [] } = useQuery(studyQuery);
  const { state, filteredStudents, dispatch } = useStudyFilter(students);
  const { searchQuery, selectedGrades, selectedClasses, selectedGender } =
    state;

  const applyMutation = useMutation({
    mutationFn: dormitoryMutations.applyStudy,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: studyQuery.queryKey }),
    onError: (error) => {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === HttpStatusCode.BadRequest) {
        toast.error("자습 신청 시간이 아닙니다.");
        return;
      }
      if (status === HttpStatusCode.Forbidden) {
        toast.error("자습 금지 상태입니다.");
        return;
      }
      if (status === HttpStatusCode.Conflict) {
        toast.error("이미 자습을 신청했습니다.");
        return;
      }

      toast.error("자습 신청에 실패했습니다.");
    },
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
  const handleApplyStudy = () => applyMutation.mutate();

  return (
    <section className="bg-background-surface rounded-2xl p-6 flex flex-col gap-4">
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
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-4 max-h-125 overflow-y-auto">
            {filteredStudents.map((student, index) => (
              <ProfileCard
                key={student.studentNumber}
                index={index + 1}
                student={student}
              />
            ))}
          </div>
        </div>

        <div className="w-[330px] shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-main-text text-text-2">필터</span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sub-1 text-caption-2 cursor-pointer hover:text-p-1 transition-colors"
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
            variant="filled"
            size="wide"
            onClick={handleApplyStudy}
          >
            신청하기
          </TextButton>

          <p className="text-sub-2 text-caption-2">
            자습 신청 시간은 20:00 ~ 21:00 입니다
          </p>
        </div>
      </div>
    </section>
  );
}
