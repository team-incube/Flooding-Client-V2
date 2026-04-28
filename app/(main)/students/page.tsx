import { StudentManagementSection } from "@/features/self-study/ui/StudentManagementSection";

export default function StudentsPage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto px-8 lg:px-10 2xl:px-18 pb-25">
      <StudentManagementSection />
    </main>
  );
}
