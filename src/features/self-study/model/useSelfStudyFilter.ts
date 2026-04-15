import { useReducer } from "react";
import { getClassNumber, getGrade } from "@/entities/user/lib/getUserInfo";
import type { Sex } from "@/entities/user/model/user";
import type { DormitoryStudent } from "@/entities/dormitory/model/types";

export function toggleFilter<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export interface FilterState {
  searchQuery: string;
  selectedGrades: number[];
  selectedClasses: number[];
  selectedGender: Sex | null;
}

export type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_GRADE"; payload: number }
  | { type: "TOGGLE_CLASS"; payload: number }
  | { type: "SET_GENDER"; payload: Sex | null }
  | { type: "RESET" };

export const initialFilterState: FilterState = {
  searchQuery: "",
  selectedGrades: [],
  selectedClasses: [],
  selectedGender: null,
};

export function filterReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
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
      return initialFilterState;
  }
}

export function useStudyFilter(students: DormitoryStudent[]) {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const { searchQuery, selectedGrades, selectedClasses, selectedGender } =
    state;

  const filteredStudents = students.filter((s) => {
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
    if (selectedGender && s.sex !== selectedGender) return false;
    return true;
  });

  return { state, filteredStudents, dispatch };
}
