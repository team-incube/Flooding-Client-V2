import MassageApplyCard from "@/widgets/main/ui/MassageApplyCard";
import StudyApplyCard from "@/widgets/main/ui/StudyApplyCard";
import { MealCardBoundary } from "@/widgets/main/ui/MealCard";
import ProfileCard from "@/widgets/main/ui/ProfileCard";
import { TimeTableCardBoundary } from "@/widgets/main/ui/TimeTableCard";
import HomebaseCard from "@/widgets/main/ui/HomebaseCard";
import { WakeUpMusicSection } from "@/features/wake-up-music/ui/WakeUpMusicSection";
import Star from "@/shared/asset/svg/Star";

export default function MainPage() {
  return (
    <main className="flex-1 overflow-auto px-5 pb-25 sm:px-8 lg:px-10 2xl:px-18">
      <div className="mb-4 grid grid-cols-1 gap-4 lg:mb-5 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5 2xl:mb-6 2xl:grid-cols-[562fr_426fr_480fr]">
        <div className="order-1 max-sm:hidden lg:col-span-2 2xl:col-span-1 2xl:col-start-3 2xl:row-start-1">
          <ProfileCard />
        </div>
        <div className="order-2 lg:col-span-2 2xl:col-span-1 2xl:col-start-3 2xl:row-start-2">
          <TimeTableCardBoundary />
        </div>
        <div className="order-3 flex flex-col gap-4 lg:gap-6 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1">
          <StudyApplyCard />
          <MassageApplyCard />
        </div>
        <div className="order-4 2xl:col-start-2 2xl:row-span-2 2xl:row-start-1">
          <MealCardBoundary />
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:gap-5 2xl:gap-6">
        <WakeUpMusicSection icon={<Star />} />
        <HomebaseCard showMyReservationStatus />
      </div>
    </main>
  );
}
