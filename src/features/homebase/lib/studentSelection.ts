export interface HomebaseSelectableStudent {
  id: number;
  name: string;
  studentNumber: number;
}

interface FilterAvailableStudentsParams {
  searchKeyword: string;
  selectedStudents: HomebaseSelectableStudent[];
  students: HomebaseSelectableStudent[];
}

export function filterAvailableStudents({
  searchKeyword,
  selectedStudents,
  students,
}: FilterAvailableStudentsParams): HomebaseSelectableStudent[] {
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

    return matchesSearchKeyword && !selectedStudentIds.has(student.id);
  });
}

export function removeSelectedStudent(
  selectedStudents: HomebaseSelectableStudent[],
  studentNumber: number,
): HomebaseSelectableStudent[] {
  return selectedStudents.filter(
    (selectedStudent) => selectedStudent.studentNumber !== studentNumber,
  );
}
