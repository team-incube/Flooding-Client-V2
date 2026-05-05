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
    <div className="border border-sub-4 rounded-lg overflow-hidden bg-background-surface shadow-md">
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
