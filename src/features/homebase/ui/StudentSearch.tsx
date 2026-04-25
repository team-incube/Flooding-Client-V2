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
    <div className="border border-sub-4 rounded-lg overflow-hidden">
      <div className="flex flex-col divide-y divide-sub-4 px-2">
        {filteredStudents.map((student) => (
          <button
            key={student.id}
            type="button"
            disabled={isFull}
            onClick={() => onSelect(student)}
            className={`w-full text-left py-4 px-2 ${
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
