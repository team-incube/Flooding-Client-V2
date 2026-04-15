import { useReducer } from "react";
import type { DormitoryStudent } from "@/entities/dormitory/model/dormitory";
import { filterStudyStudents } from "../lib/filter-study-students";
import {
  filterReducer,
  initialFilterState,
} from "./studyFilterReducer";

export function useStudyFilter(students: DormitoryStudent[]) {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const filteredStudents = filterStudyStudents({
    filterState: state,
    students,
  });

  return { state, filteredStudents, dispatch };
}
