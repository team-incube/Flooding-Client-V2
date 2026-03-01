import Sidebar from "@/widgets/adaptive-sidebar/ui";
import { DarkModeToggle } from "@/shared/ui/Toggle/DarkModeToggle";
import ApplyCard from "@/widgets/main/ui/ApplyCard";
import ChairIcon from "@/shared/asset/svg/Chair";
import BookIcon from "@/shared/asset/svg/ApplyStudy";

export default function MainView() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto px-18 pt-13 pb-25">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-3">
            <span className="text-size-title-2 font-bold text-main-text leading-none">
              홈
            </span>

            <div className="flex items-end gap-2 bg-background-surface rounded-lg px-5 py-2">
              <span className="text-size-title-2 font-bold text-main-text leading-none">
                14:02:37
              </span>
              <span className="text-size-text-3 text-sub-1 leading-none">
                26.02.22
              </span>
            </div>
          </div>

          <DarkModeToggle />
        </div>

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
      </main>
    </div>
  );
}
