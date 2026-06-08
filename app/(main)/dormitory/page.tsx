import { SelfStudySection } from "@/features/self-study/ui/SelfStudySection";
import { MassageChairSection } from "@/features/massage-chair/ui/MassageChairSection";
import { WakeUpMusicSection } from "@/features/wake-up-music/ui/WakeUpMusicSection";
import { HashScroller } from "@/shared/ui/HashScroller";

export default function DormitoryPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-25 sm:gap-6 sm:px-8 lg:px-10 2xl:px-18">
      <HashScroller />
      <section id="self-study" className="scroll-mt-4">
        <SelfStudySection />
      </section>
      <section id="massage" className="scroll-mt-4">
        <MassageChairSection />
      </section>
      <section id="wake-up-music" className="scroll-mt-4">
        <WakeUpMusicSection className="h-auto! w-full" />
      </section>
    </main>
  );
}
