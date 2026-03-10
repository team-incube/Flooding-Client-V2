import { User } from "@/entities/user/model/user";
import Cancel from "@/shared/asset/svg/Cancel";

interface SelectedStudentProps {
  selectedStudents: User[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function SelectedStudent({ selectedStudents, setSelectedStudents}: SelectedStudentProps) {
  const removeStudent = (id: number) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== id));
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
            onClick={() => removeStudent(student.id)}
            className="cursor-pointer"
          >
            <Cancel />
          </button>
        </div>
      ))}
    </div>
  );
}