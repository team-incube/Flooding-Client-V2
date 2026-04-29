import { getClassNumber, getGrade } from "@/entities/user/lib/getUserInfo";
import type { StudyApplicant } from "@/entities/dormitory/model/dormitory";
import type { FilterState } from "../model/studyFilterReducer";

interface FilterStudyStudentsParams {
  filterState: FilterState;
  students: StudyApplicant[];
}

export function filterStudyStudents({
  filterState,
  students,
}: FilterStudyStudentsParams): StudyApplicant[] {
  const {
    searchQuery,
    selectedGrades,
    selectedClasses,
    selectedGender,
  } = filterState;

  return students.filter((student) => {
    const matchesSearchQuery =
      !searchQuery ||
      student.name.includes(searchQuery) ||
      String(student.studentNumber).includes(searchQuery);
    const matchesGrade =
      selectedGrades.length === 0 ||
      selectedGrades.includes(getGrade(student.studentNumber));
    const matchesClass =
      selectedClasses.length === 0 ||
      selectedClasses.includes(getClassNumber(student.studentNumber));
    const matchesGender = !selectedGender || student.sex === selectedGender;

    return (
      matchesSearchQuery &&
      matchesGrade &&
      matchesClass &&
      matchesGender
    );
  });
}
