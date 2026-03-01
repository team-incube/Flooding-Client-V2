import { DormitoryHeader } from "@/widgets/dormitory-header/ui/DormitoryHeader";
import { SelfStudySection } from "@/features/self-study/ui/SelfStudySection";
import { MassageChairSection } from "@/features/massage-chair/ui/MassageChairSection";
import { WakeUpSongSection } from "@/features/wake-up-song/ui/WakeUpSongSection";

export default function DormitoryPage() {
  return (
    <>
      <DormitoryHeader />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <SelfStudySection />
        <MassageChairSection />
        <WakeUpSongSection />
      </main>
    </>
  );
}
