import type { SearchUser } from "@/entities/user/model/user";

export type StudyBanFilter = "ALLOWED" | "BANNED" | null;

interface FilterManagedStudentsParams {
  students: SearchUser[];
  searchQuery: string;
  selectedGrades: number[];
  selectedClasses: number[];
  selectedStudyBanFilter: StudyBanFilter;
  bannedStudentIds: number[];
}

export function filterManagedStudents({
  students,
  searchQuery,
  selectedGrades,
  selectedClasses,
  selectedStudyBanFilter,
  bannedStudentIds,
}: FilterManagedStudentsParams): SearchUser[] {
  const normalizedSearchQuery = searchQuery.trim();

  return students.filter((student) => {
    const isBanned = student.isBanned || bannedStudentIds.includes(student.id);
    const matchesSearchQuery =
      !normalizedSearchQuery ||
      student.name.includes(normalizedSearchQuery) ||
      String(student.studentNumber).includes(normalizedSearchQuery);
    const matchesGrade =
      selectedGrades.length === 0 || selectedGrades.includes(student.grade);
    const matchesClass =
      selectedClasses.length === 0 ||
      selectedClasses.includes(student.classNumber);
    const matchesStudyBan =
      !selectedStudyBanFilter ||
      (selectedStudyBanFilter === "BANNED" ? isBanned : !isBanned);

    return (
      matchesSearchQuery &&
      matchesGrade &&
      matchesClass &&
      matchesStudyBan
    );
  });
}
