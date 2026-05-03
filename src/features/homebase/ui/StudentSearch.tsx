import type { User } from "@/entities/user/model/user";

interface StudentSearchProps {
  filteredStudents: User[];
  isFull: boolean;
  onSelect: (student: User) => void;
}

export function StudentSearch({
  filteredStudents,
  isFull,
  onSelect,
}: StudentSearchProps) {
  if (filteredStudents.length === 0) return null;

  return (
    <div className="border-sub-4 bg-background-surface overflow-hidden rounded-lg border shadow-md">
      <div className="divide-sub-4 flex flex-col divide-y px-2">
        {filteredStudents.map((student) => (
          <button
            key={student.id}
            type="button"
            disabled={isFull}
            onClick={() => onSelect(student)}
            className={`w-full px-2 py-4 text-left ${
              isFull ? "cursor-not-allowed opacity-40" : "cursor-pointer"
            }`}
          >
            {student.studentNumber} {student.name}
          </button>
        ))}
      </div>
    </div>
  );
}
