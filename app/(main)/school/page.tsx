"use client";

import { useState } from "react";
import HomebaseCard from "@/widgets/main/ui/HomebaseCard";
import {
  MOCK_RESERVATIONS,
  MOCK_MY_RESERVATION,
} from "@/entities/school/model/mock";

export default function SchoolPage() {
  const [selectedFloor, setSelectedFloor] = useState("2F");

  const filteredReservations = MOCK_RESERVATIONS.filter(
    (item) => item.floor === selectedFloor,
  );

  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 lg:px-10 2xl:px-18 pb-25">
      <HomebaseCard
        selectedFloor={selectedFloor}
        onFloorChange={setSelectedFloor}
        myReservation={MOCK_MY_RESERVATION}
        reservations={filteredReservations}
      />
    </main>
  );
}
