import { MOCK_STUDENTS } from "@/entities/user/model/mock";
import { User } from "@/entities/user/model/user"

interface StudentSearchProps {
  search: string;
  selectedStudents: User[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<User[]>>;
  isFull: boolean;
}

export default function StudentSearch({ 
  search,
  selectedStudents,
  setSelectedStudents,
  isFull,
  }: StudentSearchProps) {
  const selectedStudentIds = new Set(selectedStudents.map((s) => s.id));
  const filteredStudents = MOCK_STUDENTS.filter(
    (student) =>
      !selectedStudentIds.has(student.id) &&
      (student.name.includes(search) ||
        student.studentNumber.toString().includes(search))
  );

  const addStudent = (student: User) => {
    if (isFull) return;
    setSelectedStudents((prev) => [...prev, student]);
  }

  if (!search) return null;
  
  return (
    <div className="border border-sub-4 rounded-lg overflow-hidden">
      <div className="flex flex-col divide-y divide-sub-4 px-2">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => addStudent(student)}
            className={`py-4 px-2 ${isFull ? "cursor-not-allowed" : "cursor-pointer border-b border-sub-4 last:border-0"}`} 
          >
            {student.studentNumber} {student.name}
          </div>
        ))}
      </div>
    </div>
  );
}