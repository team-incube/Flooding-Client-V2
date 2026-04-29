import { SelfStudySection } from "@/features/self-study/ui/SelfStudySection";
import { MassageChairSection } from "@/features/massage-chair/ui/MassageChairSection";
import { WakeUpMusicSection } from "@/features/wake-up-music/ui/WakeUpMusicSection";

export default function DormitoryPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 lg:px-10 2xl:px-18 pb-25">
      <SelfStudySection />
      <MassageChairSection />
      <WakeUpMusicSection className="flex-1 !h-auto" />
    </main>
  );
}
