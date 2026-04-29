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
    <div className="max-h-72 overflow-hidden rounded-lg border border-sub-4 bg-background-surface shadow-md">
      <div className="flex max-h-72 flex-col divide-y divide-sub-4 overflow-y-auto px-2">
        {filteredStudents.map((student) => (
          <button
            key={student.id}
            type="button"
            disabled={isFull}
            onClick={() => onSelect(student)}
            className={`w-full truncate px-2 py-4 text-left text-main-text ${
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
