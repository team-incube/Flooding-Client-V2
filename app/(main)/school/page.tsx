import { Suspense } from "react";
import HomebaseCard from "@/widgets/main/ui/HomebaseCard";

export default function SchoolPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 lg:px-10 2xl:px-18 pb-25">
      <Suspense>
        <HomebaseCard showReservations />
      </Suspense>
    </main>
  );
}
