import type { User, Sex } from "@/entities/user/model/user";

export type StudyBanFilter = "ALLOWED" | "BANNED" | null;

interface FilterManagedStudentsParams {
  students: User[];
  searchQuery: string;
  selectedGrades: number[];
  selectedClasses: number[];
  selectedGender: Sex | null;
  selectedStudyBanFilter: StudyBanFilter;
  bannedStudentIds: number[];
}

export function filterManagedStudents({
  students,
  searchQuery,
  selectedGrades,
  selectedClasses,
  selectedGender,
  selectedStudyBanFilter,
  bannedStudentIds,
}: FilterManagedStudentsParams): User[] {
  const normalizedSearchQuery = searchQuery.trim();

  return students.filter((student) => {
    const isBanned = bannedStudentIds.includes(student.id);
    const matchesSearchQuery =
      !normalizedSearchQuery ||
      student.name.includes(normalizedSearchQuery) ||
      String(student.studentNumber).includes(normalizedSearchQuery);
    const matchesGrade =
      selectedGrades.length === 0 || selectedGrades.includes(student.grade);
    const matchesClass =
      selectedClasses.length === 0 ||
      selectedClasses.includes(student.classNumber);
    const matchesGender =
      !selectedGender || student.sex === selectedGender;
    const matchesStudyBan =
      !selectedStudyBanFilter ||
      (selectedStudyBanFilter === "BANNED" ? isBanned : !isBanned);

    return (
      matchesSearchQuery &&
      matchesGrade &&
      matchesClass &&
      matchesGender &&
      matchesStudyBan
    );
  });
}
