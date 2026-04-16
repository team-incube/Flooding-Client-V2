import type { Dispatch, SetStateAction } from "react";
import type { User } from "@/entities/user/model/user";
import Cancel from "@/shared/asset/svg/Cancel";
import { removeSelectedStudent } from "../lib/studentSelection";

interface SelectedStudentProps {
  selectedStudents: User[];
  setSelectedStudents: Dispatch<SetStateAction<User[]>>;
}

export default function SelectedStudent({
  selectedStudents,
  setSelectedStudents,
}: SelectedStudentProps) {
  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudents((prev) =>
      removeSelectedStudent(prev, studentId),
    );
  };

  return (
    <div className="flex flex-wrap justify-around gap-2">
      {selectedStudents.map((student) => (
        <div
          key={student.id}
          className="flex items-center gap-2 border border-sub-2 rounded-full px-5.5 py-3"
        >
          <span>
            {student.studentNumber} {student.name}
          </span>

          <button
            onClick={() => handleRemoveStudent(student.id)}
            className="cursor-pointer"
          >
            <Cancel />
          </button>
        </div>
      ))}
    </div>
  );
}
