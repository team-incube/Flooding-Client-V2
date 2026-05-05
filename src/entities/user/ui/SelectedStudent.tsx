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
