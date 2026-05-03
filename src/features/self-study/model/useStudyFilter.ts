import { useReducer } from "react";
import type { StudyApplicant } from "@/entities/dormitory/model/dormitory";
import { filterStudyStudents } from "../lib/filterStudyStudents";
import { filterReducer, initialFilterState } from "./studyFilterReducer";

export function useStudyFilter(students: StudyApplicant[]) {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const filteredStudents = filterStudyStudents({
    filterState: state,
    students,
  });

  return { state, filteredStudents, dispatch };
}
