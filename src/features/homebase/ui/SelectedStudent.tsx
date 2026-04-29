import type { User } from "@/entities/user/model/user";
import Cancel from "@/shared/asset/svg/Cancel";

interface SelectedStudentProps {
  selectedStudents: User[];
  onRemoveStudent: (studentNumber: number) => void;
}

export function SelectedStudent({
  selectedStudents,
  onRemoveStudent,
}: SelectedStudentProps) {
  return (
    <div className="flex max-h-40 min-w-0 flex-wrap justify-start gap-2 overflow-y-auto pr-1">
      {selectedStudents.map((student) => (
        <div
          key={student.id}
          className="flex min-w-0 max-w-full items-center gap-2 rounded-full border border-sub-2 px-5.5 py-3"
        >
          <span className="min-w-0 truncate text-sub-1">
            {student.studentNumber} {student.name}
          </span>

          <button
            type="button"
            onClick={() => onRemoveStudent(student.studentNumber)}
            className="cursor-pointer"
          >
            <Cancel />
          </button>
        </div>
      ))}
    </div>
  );
}
