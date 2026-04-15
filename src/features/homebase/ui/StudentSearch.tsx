import type { Dispatch, SetStateAction } from "react";
import { MOCK_STUDENTS } from "@/entities/user/model/mock";
import type { User } from "@/entities/user/model/user";
import { filterAvailableStudents } from "../lib/student-selection";

interface StudentSearchProps {
  search: string;
  selectedStudents: User[];
  setSelectedStudents: Dispatch<SetStateAction<User[]>>;
  isFull: boolean;
}

export default function StudentSearch({
  search,
  selectedStudents,
  setSelectedStudents,
  isFull,
}: StudentSearchProps) {
  const filteredStudents = filterAvailableStudents({
    searchKeyword: search,
    selectedStudents,
    students: MOCK_STUDENTS,
  });

  const handleAddStudent = (student: User) => {
    if (isFull) return;

    setSelectedStudents((prev) => [...prev, student]);
  };

  if (!search) return null;

  return (
    <div className="border border-sub-4 rounded-lg overflow-hidden">
      <div className="flex flex-col divide-y divide-sub-4 px-2">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => handleAddStudent(student)}
            className={`py-4 px-2 ${
              isFull
                ? "cursor-not-allowed"
                : "cursor-pointer border-b border-sub-4 last:border-0"
            }`}
          >
            {student.studentNumber} {student.name}
          </div>
        ))}
      </div>
    </div>
  );
}
