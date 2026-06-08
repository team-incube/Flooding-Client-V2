import type { SearchUser, Sex } from "@/entities/user/model/user";

export type StudyBanFilter = "ALLOWED" | "BANNED";

const EXCLUDED_NAMES = ["사감선생님"];

interface FilterManagedStudentsParams {
  students: SearchUser[];
  searchQuery: string;
  selectedGrades: number[];
  selectedClasses: number[];
  selectedGender: Sex | null;
  selectedStudyBanFilter: StudyBanFilter;
}

export function filterManagedStudents({
  students,
  searchQuery,
  selectedGrades,
  selectedClasses,
  selectedGender,
  selectedStudyBanFilter,
}: FilterManagedStudentsParams): SearchUser[] {
  const normalizedSearchQuery = searchQuery.trim();

  return students.filter((student) => {
    const isStudent = !EXCLUDED_NAMES.includes(student.name);
    const matchesSearchQuery =
      !normalizedSearchQuery ||
      student.name.includes(normalizedSearchQuery) ||
      String(student.studentNumber).includes(normalizedSearchQuery);
    const matchesGrade =
      selectedGrades.length === 0 || selectedGrades.includes(student.grade);
    const matchesClass =
      selectedClasses.length === 0 ||
      selectedClasses.includes(student.classNumber);
    const matchesGender = !selectedGender || student.sex === selectedGender;
    const matchesStudyBan =
      selectedStudyBanFilter === "BANNED"
        ? student.isBanned
        : !student.isBanned;

    return (
      isStudent &&
      matchesSearchQuery &&
      matchesGrade &&
      matchesClass &&
      matchesGender &&
      matchesStudyBan
    );
  });
}
