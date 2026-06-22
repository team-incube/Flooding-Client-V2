"use client";

import dynamic from "next/dynamic";
const HomebaseCard = dynamic(() => import("@/widgets/main/ui/HomebaseCard"), {
  ssr: false,
});

export default function SchoolPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-25 sm:gap-6 sm:px-8 lg:px-10 2xl:px-18">
      <HomebaseCard showMyReservationStatus showAllReservationStatus />
    </main>
  );
}
