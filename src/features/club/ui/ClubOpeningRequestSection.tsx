"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clubQueries } from "@/entities/club/api/clubQueries";
import { userQueries } from "@/entities/user/api/userQueries";
import ClubCard from "@/entities/club/ui/ClubCard";

export function ClubOpeningRequestSection() {
  const router = useRouter();
  const { data: user } = useQuery(userQueries.me());
  const isManager = user?.role === "ADMIN" || user?.role === "STUDENT_COUNCIL";
  const { data } = useQuery({
    ...clubQueries.openingRequests(),
    enabled: isManager,
  });
  const clubs = data?.clubs ?? [];

  if (clubs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-text-1 text-main-text font-semibold">개설 신청 목록</span>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(263px,1fr))] gap-4">
        {clubs.map((club) => (
          <ClubCard
            key={club.id}
            club={club}
            onClick={() => router.push(`/club/${club.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
