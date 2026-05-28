import { SelfStudySection } from "@/features/self-study/ui/SelfStudySection";
import { MassageChairSection } from "@/features/massage-chair/ui/MassageChairSection";
import { WakeUpMusicSection } from "@/features/wake-up-music/ui/WakeUpMusicSection";

export default function DormitoryPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-25 sm:gap-6 sm:px-8 lg:px-10 2xl:px-18">
      <SelfStudySection />
      <MassageChairSection />
      <WakeUpMusicSection className="h-auto! flex-1" />
    </main>
  );
}
