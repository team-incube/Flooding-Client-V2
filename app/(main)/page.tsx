import ApplyCard from "@/widgets/main/ui/ApplyCard";
import MealCard from "@/widgets/main/ui/MealCard";
import ChairIcon from "@/shared/asset/svg/Chair";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import ProfileCard from "@/widgets/main/ui/ProfileCard";
import TimeTableCard from "@/widgets/main/ui/TimeTableCard";
import MusicRequestCard from "@/widgets/main/ui/MusicRequestCard";
import HomebaseCard from "@/widgets/main/ui/HomebaseCard";

export default function MainPage() {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-auto p-6 pb-20">
        <div className="flex gap-6 mb-6">
          <div className="flex flex-col gap-6 flex-1 min-w-[440px] 2xl:min-w-[500px] max-w-[648px]">
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
          <MealCard />
          <div className="flex flex-col gap-6 flex-1 max-w-[570px]">
            <ProfileCard />
            <TimeTableCard />
          </div>
        </div>
        <MusicRequestCard />
        <HomebaseCard />
      </main>
    </div>
  );
}
