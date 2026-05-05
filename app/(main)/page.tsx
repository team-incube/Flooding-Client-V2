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
    <main className="flex-1 overflow-auto px-8 pb-25 lg:px-10 2xl:px-18">
      <div className="mb-4 grid grid-cols-1 gap-x-4 gap-y-4 lg:mb-5 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-5 2xl:mb-6 2xl:grid-cols-[562fr_426fr_480fr]">
        <div className="order-2 flex flex-col gap-4 lg:gap-6 2xl:order-0 2xl:row-span-2">
          <StudyApplyCard />
          <MassageApplyCard />
        </div>
        <div className="order-3 2xl:order-0 2xl:row-span-2">
          <MealCardBoundary />
        </div>
        <div className="order-1 lg:col-span-2 2xl:order-0 2xl:contents">
          <div className="flex flex-row gap-3 max-md:flex-col lg:gap-6 2xl:contents">
            <div className="flex-1">
              <ProfileCard />
            </div>
            <div className="flex-1">
              <TimeTableCardBoundary />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:gap-5 2xl:gap-6">
        <WakeUpMusicSection icon={<Star />} />
        <HomebaseCard showMyReservationStatus />
      </div>
    </main>
  );
}
