import { useReducer } from "react";
import { getClassNumber, getGrade } from "@/entities/user/lib/getUserInfo";
import type { DormitoryStudent } from "@/entities/dormitory/model/types";
import {
  filterReducer,
  initialFilterState,
} from "./studyFilterReducer";

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
