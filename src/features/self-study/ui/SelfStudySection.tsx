"use client";

import { useReducer } from "react";
import ApplyStudy from "@/shared/asset/svg/ApplyStudy";
import Search from "@/shared/asset/svg/Search";
import { ProfileCard } from "@/shared/ui/ProfileCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { NumberButton } from "@/shared/ui/Button/NumberButton";
import TextField from "@/shared/ui/textField";
import { MOCK_STUDENTS } from "@/entities/user/model/mock";
import { getClassNumber, getGrade } from "@/entities/user/lib/getUserInfo";

function toggleFilter<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

interface FilterState {
  searchQuery: string;
  selectedGrades: number[];
  selectedClasses: number[];
  selectedGender: "male" | "female" | null;
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_GRADE"; payload: number }
  | { type: "TOGGLE_CLASS"; payload: number }
  | { type: "SET_GENDER"; payload: "male" | "female" | null }
  | { type: "RESET" };

const initialState: FilterState = {
  searchQuery: "",
  selectedGrades: [],
  selectedClasses: [],
  selectedGender: null,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "TOGGLE_GRADE":
      return {
        ...state,
        selectedGrades: toggleFilter(state.selectedGrades, action.payload),
      };
    case "TOGGLE_CLASS":
      return {
        ...state,
        selectedClasses: toggleFilter(state.selectedClasses, action.payload),
      };
    case "SET_GENDER":
      return { ...state, selectedGender: action.payload };
    case "RESET":
      return initialState;
  }
}

export function SelfStudySection() {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const { searchQuery, selectedGrades, selectedClasses, selectedGender } =
    state;

  const filteredStudents = MOCK_STUDENTS.filter((s) => {
    if (
      searchQuery &&
      !s.name.includes(searchQuery) &&
      !String(s.studentNumber).includes(searchQuery)
    )
      return false;
    if (
      selectedGrades.length > 0 &&
      !selectedGrades.includes(getGrade(s.studentNumber))
    )
      return false;
    if (
      selectedClasses.length > 0 &&
      !selectedClasses.includes(getClassNumber(s.studentNumber))
    )
      return false;
    if (
      selectedGender &&
      (s.sex === "MAN" ? "male" : "female") !== selectedGender
    )
      return false;
    return true;
  });

  return (
    <section className="bg-background-surface rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ApplyStudy />
          <span className="text-main-text font-bold text-[18px]">자습신청</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sub-1 text-[14px]">신청인</span>
          <span className="text-p-1 font-bold text-[14px]">
            {filteredStudents.length}명
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-4 max-h-150 overflow-y-auto">
            {filteredStudents.map((student, index) => (
              <ProfileCard
                key={student.studentNumber}
                index={index}
                name={student.name}
                studentId={String(student.studentNumber)}
                gender={student.sex === "MAN" ? "male" : "female"}
              />
            ))}
          </div>
        </div>

        <div className="w-[330px] shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-main-text font-semibold text-[16px]">
              필터
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET" })}
              className="text-sub-1 text-[13px] cursor-pointer hover:text-p-1 transition-colors"
            >
              초기화
            </button>
          </div>

          <TextField
            placeholder="학생 이름, 학번을 입력해주세요"
            value={searchQuery}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
            rightIcon={<Search />}
          />

          <div className="flex flex-col gap-2">
            <span className="text-sub-1 text-[14px] font-medium">학년</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((grade) => (
                <NumberButton
                  key={grade}
                  variant={
                    selectedGrades.includes(grade) ? "filled" : "outlined"
                  }
                  onClick={() =>
                    dispatch({ type: "TOGGLE_GRADE", payload: grade })
                  }
                >
                  {grade}
                </NumberButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sub-1 text-[14px] font-medium">반</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((cls) => (
                <NumberButton
                  key={cls}
                  variant={
                    selectedClasses.includes(cls) ? "filled" : "outlined"
                  }
                  onClick={() =>
                    dispatch({ type: "TOGGLE_CLASS", payload: cls })
                  }
                >
                  {cls}
                </NumberButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sub-1 text-[14px] font-medium">성별</span>
            <div className="flex gap-2">
              <TextButton
                variant={selectedGender === "male" ? "filled" : "outlined"}
                size="small"
                onClick={() =>
                  dispatch({
                    type: "SET_GENDER",
                    payload: selectedGender === "male" ? null : "male",
                  })
                }
              >
                남자
              </TextButton>
              <TextButton
                variant={selectedGender === "female" ? "filled" : "outlined"}
                size="small"
                onClick={() =>
                  dispatch({
                    type: "SET_GENDER",
                    payload: selectedGender === "female" ? null : "female",
                  })
                }
              >
                여자
              </TextButton>
            </div>
          </div>

          <div className="flex-1" />

          <TextButton variant="filled" size="wide" onClick={() => {}}>
            신청하기
          </TextButton>

          <p className="text-sub-2 text-[13px]">
            자습 신청 시간은 20:00 ~ 21:00 입니다
          </p>
        </div>
      </div>
    </section>
  );
}
