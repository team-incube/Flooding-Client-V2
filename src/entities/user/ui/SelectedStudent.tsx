import Cancel from "@/shared/asset/svg/Cancel";

interface StudentItem {
  id: number;
  name: string;
  studentNumber: number;
}

interface SelectedStudentProps {
  selectedStudents: StudentItem[];
  onRemoveStudent: (studentNumber: number) => void;
}

export function SelectedStudent({
  selectedStudents,
  onRemoveStudent,
}: SelectedStudentProps) {
  return (
    <div className="flex max-h-40 w-full min-w-0 flex-wrap justify-start gap-2 overflow-y-auto pr-1">
      {selectedStudents.map((student) => (
        <div
          key={student.id}
          className="flex min-w-fit max-w-full items-center gap-2 rounded-full border border-sub-2 px-5.5 py-3"
        >
          <span className="min-w-0 truncate text-sub-1">
            {student.studentNumber} {student.name}
          </span>

          <button
            type="button"
            onClick={() => onRemoveStudent(student.studentNumber)}
            className="shrink-0 cursor-pointer"
          >
            <Cancel />
          </button>
        </div>
      ))}
    </div>
  );
}
