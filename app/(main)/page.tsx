import ApplyCard from "@/widgets/main/ui/ApplyCard";
import MealCard from "@/widgets/main/ui/MealCard";
import ChairIcon from "@/shared/asset/svg/Chair";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import ProfileCard from "@/widgets/main/ui/ProfileCard";
import TimeTableCard from "@/widgets/main/ui/TimeTableCard";
import HomebaseCard from "@/widgets/main/ui/HomebaseCard";
import { MOCK_STUDENTS } from "@/entities/user/model/mock";
import { WakeUpMusicSection } from "@/features/wake-up-music/ui/WakeUpMusicSection";
import Star from "@/shared/asset/svg/Star";

export default function MainPage() {
  return (
    <main className="flex-1 overflow-auto px-8 lg:px-10 2xl:px-18 pb-25">
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-[562fr_426fr_480fr] gap-x-4 gap-y-4 lg:gap-x-6 lg:gap-y-5 mb-4 lg:mb-5 2xl:mb-6">
        <div className="flex flex-col gap-4 lg:gap-6 order-2 2xl:order-none 2xl:row-span-2">
          <ApplyCard
            title="자습신청"
            icon={<BookIcon />}
            current={4}
            total={50}
            timeText="자습 신청 시간은 20:00 ~ 21:00에 신청이 가능해요"
            buttonText="신청 불가"
            disabled
          />
          <ApplyCard
            title="안마의자"
            icon={<ChairIcon />}
            current={4}
            total={5}
            timeText="안마 의자 신청 시간은 20:20 ~ 21:00에 신청이 가능해요"
            buttonText="신청"
            femaleNotice
          />
        </div>
        <div className="order-3 2xl:order-none 2xl:row-span-2">
          <MealCard />
        </div>
        <div className="order-1 2xl:order-none lg:col-span-2 2xl:contents">
          <div className="flex flex-row gap-3 lg:gap-6 2xl:contents">
            <div className="flex-1">
              <ProfileCard user={MOCK_STUDENTS[0]} />
            </div>
            <div className="flex-1">
              <TimeTableCard />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:gap-5 2xl:gap-6">
        <WakeUpMusicSection icon={<Star />} />
        <HomebaseCard showReservations={false} />
      </div>
    </main>
  );
}
