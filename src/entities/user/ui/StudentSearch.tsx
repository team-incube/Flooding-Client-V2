interface StudentItem {
  id: number;
  name: string;
  studentNumber: number;
}

interface StudentSearchProps<T extends StudentItem> {
  filteredStudents: T[];
  isFull: boolean;
  onSelect: (student: T) => void;
}

export function StudentSearch<T extends StudentItem>({
  filteredStudents,
  isFull,
  onSelect,
}: StudentSearchProps<T>) {
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
