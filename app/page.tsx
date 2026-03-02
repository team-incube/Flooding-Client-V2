import Sidebar from "@/widgets/adaptive-sidebar/ui";
import ApplyCard from "@/widgets/main/ui/ApplyCard";
import MealCard from "@/widgets/main/ui/MealCard";
import ChairIcon from "@/shared/asset/svg/Chair";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import Header from "@/widgets/main/ui/Header";
import ProfileCard from "@/widgets/main/ui/ProfileCard";
import TimeTableCard from "@/widgets/main/ui/TimeTableCard";
import MusicRequestCard from "@/widgets/main/ui/MusicRequestCard";

export default function MainPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <Header />
        <div className="flex gap-6 mb-6">
          <div className="flex flex-col gap-6">
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
      </main>
    </div>
  );
}
