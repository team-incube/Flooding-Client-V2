import { SelfStudySection } from "@/features/self-study/ui/SelfStudySection";
import { MassageChairSection } from "@/features/massage-chair/ui/MassageChairSection";
import { WakeUpMusicSection } from "@/features/wake-up-music/ui/WakeUpMusicSection";

export default function DormitoryPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      <SelfStudySection />
      <MassageChairSection />
      <WakeUpMusicSection />
    </main>
  );
}
