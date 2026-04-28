import { StudentManagementSection } from "@/features/self-study/ui/StudentManagementSection";

export default function StudentsPage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto p-6">
      <StudentManagementSection />
    </main>
  );
}
