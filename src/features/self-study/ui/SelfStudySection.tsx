"use client";

import { useReducer } from "react";
import ApplyStudy from "@/shared/asset/svg/ApplyStudy";
import Search from "@/shared/asset/svg/Search";
import { ProfileCard } from "@/shared/ui/ProfileCard";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { NumberButton } from "@/shared/ui/Button/NumberButton";
import TextField from "@/shared/ui/textField";

const MOCK_STUDENTS = [
  {
    index: 1,
    name: "박건우",
    studentId: "20501",
    gender: "male" as const,
    grade: 2,
    cls: 5,
  },
  {
    index: 2,
    name: "이수진",
    studentId: "20502",
    gender: "female" as const,
    grade: 2,
    cls: 5,
  },
  {
    index: 3,
    name: "김태양",
    studentId: "10301",
    gender: "male" as const,
    grade: 1,
    cls: 3,
  },
  {
    index: 4,
    name: "최아름",
    studentId: "10302",
    gender: "female" as const,
    grade: 1,
    cls: 3,
  },
  {
    index: 5,
    name: "정민호",
    studentId: "30401",
    gender: "male" as const,
    grade: 3,
    cls: 4,
  },
  {
    index: 6,
    name: "한지원",
    studentId: "20201",
    gender: "female" as const,
    grade: 2,
    cls: 2,
  },
  {
    index: 1,
    name: "오준혁",
    studentId: "10101",
    gender: "male" as const,
    grade: 1,
    cls: 1,
  },
  {
    index: 2,
    name: "윤서연",
    studentId: "20302",
    gender: "female" as const,
    grade: 2,
    cls: 3,
  },
  {
    index: 3,
    name: "강동현",
    studentId: "30201",
    gender: "male" as const,
    grade: 3,
    cls: 2,
  },
  {
    index: 4,
    name: "신예린",
    studentId: "10402",
    gender: "female" as const,
    grade: 1,
    cls: 4,
  },
  {
    index: 5,
    name: "임재원",
    studentId: "30301",
    gender: "male" as const,
    grade: 3,
    cls: 3,
  },
  {
    index: 6,
    name: "배수아",
    studentId: "20101",
    gender: "female" as const,
    grade: 2,
    cls: 1,
  },
  {
    index: 1,
    name: "조현준",
    studentId: "10201",
    gender: "male" as const,
    grade: 1,
    cls: 2,
  },
  {
    index: 2,
    name: "권나연",
    studentId: "30101",
    gender: "female" as const,
    grade: 3,
    cls: 1,
  },
  {
    index: 3,
    name: "문성민",
    studentId: "20401",
    gender: "male" as const,
    grade: 2,
    cls: 4,
  },
  {
    index: 4,
    name: "류하은",
    studentId: "10501",
    gender: "female" as const,
    grade: 1,
    cls: 5,
  },
  {
    index: 5,
    name: "서지훈",
    studentId: "30501",
    gender: "male" as const,
    grade: 3,
    cls: 5,
  },
  {
    index: 6,
    name: "남지우",
    studentId: "30402",
    gender: "female" as const,
    grade: 3,
    cls: 4,
  },
  {
    index: 6,
    name: "남지우",
    studentId: "30402",
    gender: "female" as const,
    grade: 3,
    cls: 4,
  },
  {
    index: 6,
    name: "남지우",
    studentId: "30402",
    gender: "female" as const,
    grade: 3,
    cls: 4,
  },
  {
    index: 6,
    name: "남지우",
    studentId: "30402",
    gender: "female" as const,
    grade: 3,
    cls: 4,
  },
  {
    index: 6,
    name: "남지우",
    studentId: "30402",
    gender: "female" as const,
    grade: 3,
    cls: 4,
  },
  {
    index: 6,
    name: "남지우",
    studentId: "30402",
    gender: "female" as const,
    grade: 3,
    cls: 4,
  },
  {
    index: 6,
    name: "남지우",
    studentId: "30402",
    gender: "female" as const,
    grade: 3,
    cls: 4,
  },
];

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
      !s.studentId.includes(searchQuery)
    )
      return false;
    if (selectedGrades.length > 0 && !selectedGrades.includes(s.grade))
      return false;
    if (selectedClasses.length > 0 && !selectedClasses.includes(s.cls))
      return false;
    if (selectedGender && s.gender !== selectedGender) return false;
    return true;
  });

  const handleReset = () => dispatch({ type: "RESET" });

  return (
    <section className="bg-background-surface rounded-2xl p-6 flex flex-col gap-6">
      {/* 섹션 헤더 */}
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

      {/* 본문: 카드 그리드 + 필터 패널 */}
      <div className="flex gap-6">
        {/* 좌측: 6열 프로필 카드 그리드 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-4 max-h-150 overflow-y-auto">
            {filteredStudents.map((student, i) => (
              <ProfileCard
                key={`${student.studentId}-${i}`}
                index={student.index}
                name={student.name}
                studentId={student.studentId}
                gender={student.gender}
              />
            ))}
          </div>
        </div>

        {/* 우측: 필터 패널 */}
        <div className="w-[330px] shrink-0 flex flex-col gap-4">
          {/* 필터 헤더 */}
          <div className="flex items-center justify-between">
            <span className="text-main-text font-semibold text-[16px]">
              필터
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-sub-1 text-[13px] cursor-pointer hover:text-p-1 transition-colors"
            >
              초기화
            </button>
          </div>

          {/* 검색 */}
          <TextField
            placeholder="학생 이름, 학번을 입력해주세요"
            value={searchQuery}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
            rightIcon={<Search />}
          />

          {/* 학년 필터 */}
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

          {/* 반 필터 */}
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

          {/* 성별 필터 */}
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

          {/* 신청하기 버튼 */}
          <TextButton variant="filled" size="wide" onClick={() => {}}>
            신청하기
          </TextButton>

          {/* 안내 문구 */}
          <p className="text-sub-2 text-[13px]">
            자습 신청 시간은 20:00 ~ 21:00 입니다
          </p>
        </div>
      </div>
    </section>
  );
}
