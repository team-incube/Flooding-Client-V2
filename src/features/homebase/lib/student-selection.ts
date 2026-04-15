import type { User } from "@/entities/user/model/user";

interface FilterAvailableStudentsParams {
  searchKeyword: string;
  selectedStudents: User[];
  students: User[];
}

export function filterAvailableStudents({
  searchKeyword,
  selectedStudents,
  students,
}: FilterAvailableStudentsParams): User[] {
  const normalizedSearchKeyword = searchKeyword.trim();

  if (!normalizedSearchKeyword) {
    return [];
  }

  const selectedStudentIds = new Set(
    selectedStudents.map((selectedStudent) => selectedStudent.id),
  );

  return students.filter((student) => {
    const matchesSearchKeyword =
      student.name.includes(normalizedSearchKeyword) ||
      student.studentNumber.toString().includes(normalizedSearchKeyword);

    return (
      matchesSearchKeyword && !selectedStudentIds.has(student.id)
    );
  });
}

export function removeSelectedStudent(
  selectedStudents: User[],
  studentId: number,
): User[] {
  return selectedStudents.filter(
    (selectedStudent) => selectedStudent.id !== studentId,
  );
}
