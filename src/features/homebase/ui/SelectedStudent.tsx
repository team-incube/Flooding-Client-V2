import type { Dispatch, SetStateAction } from "react";
import type { User } from "@/entities/user/model/user";
import Cancel from "@/shared/asset/svg/Cancel";
import { removeSelectedStudent } from "../lib/studentSelection";

interface SelectedStudentProps {
  selectedStudents: User[];
  setSelectedStudents: Dispatch<SetStateAction<User[]>>;
}

export function SelectedStudent({
  selectedStudents,
  setSelectedStudents,
}: SelectedStudentProps) {
  const handleRemoveStudent = (studentNumber: number) => {
    setSelectedStudents((prev) =>
      removeSelectedStudent(prev, studentNumber),
    );
  };

  return (
    <div className="flex flex-wrap justify-start gap-2">
      {selectedStudents.map((student) => (
        <div
          key={student.id}
          className="flex items-center gap-2 border border-sub-2 rounded-full px-5.5 py-3"
        >
          <span className="text-sub-1">
            {student.studentNumber} {student.name}
          </span>

          <button
            onClick={() => handleRemoveStudent(student.studentNumber)}
            className="cursor-pointer"
          >
            <Cancel />
          </button>
        </div>
      ))}
    </div>
  );
}
