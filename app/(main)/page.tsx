import Sidebar from "@/widgets/adaptive-sidebar/ui";
import ApplyCard from "@/widgets/main/ui/ApplyCard";
import MealCard from "@/widgets/main/ui/MealCard";
import ChairIcon from "@/shared/asset/svg/Chair";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import Header from "@/widgets/main/ui/Header";
import ProfileCard from "@/widgets/main/ui/ProfileCard";
import TimeTableCard from "@/widgets/main/ui/TimeTableCard";
import MusicRequestCard from "@/widgets/main/ui/MusicRequestCard";
import HomebaseCard from "@/widgets/main/ui/HomebaseCard";

export default function MainPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto px-9 pt-6 pb-12 min-[1600px]:px-18 min-[1600px]:pt-13 min-[1600px]:pb-25">
        <Header />
        <div className="flex gap-6 mb-6">
          <div className="flex flex-col gap-6 w-[564px] min-w-[440px] min-[1600px]:min-w-[500px]">
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
          <div className="flex flex-col gap-6">
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
