import Sidebar from "@/widgets/adaptive-sidebar/ui";
import ApplyCard from "@/widgets/main/ui/ApplyCard";
import MealCard from "@/widgets/main/ui/MealCard";
import ChairIcon from "@/shared/asset/svg/Chair";
import BookIcon from "@/shared/asset/svg/ApplyStudy";
import Header from "@/widgets/main/ui/Header";
import ProfileCard from "@/widgets/main/ui/ProfileCard";

export default function MainView() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto px-18 pt-13 pb-25">
        <Header />
        <div className="flex gap-6">
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
            <ProfileCard name="민솔" studentId="2403" />
            <div className="w-[480px] h-[354px] bg-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-gray-500">dw</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
