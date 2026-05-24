"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clubQueries } from "@/entities/club/api/clubQueries";
import ClubCard from "@/entities/club/ui/ClubCard";
import Club from "@/shared/asset/svg/Club";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { Skeleton } from "@/shared/ui/Skeleton";

function ClubOpeningRequestSectionLoading() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(263px,1fr))] gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-sub-4 flex min-h-[250px] flex-col gap-4 rounded-2xl px-4 py-6"
          >
            <Skeleton className="h-33.5 w-full shrink-0 rounded-2xl" />
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClubOpeningRequestSectionEmpty() {
  return (
    <div className="flex flex-col gap-3">
      <div className="border-sub-3 bg-background flex h-[320px] items-center justify-center rounded-2xl border border-dashed">
        <p className="text-text-2 text-sub-1">아직 개설 신청이 없어요.</p>
      </div>
    </div>
  );
}

function ClubOpeningRequestSectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="border-sub-3 bg-background flex h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border">
        <Club isActive={false} size={32} />
        <p className="text-text-2 text-main-text text-center">
          개설 신청을 불러오지 못했어요.
        </p>
        <TextButton variant="outlined" size="fit" onClick={onRetry}>
          다시 시도
        </TextButton>
      </div>
    </div>
  );
}

const ClubOpeningRequestSection = () => {
  const router = useRouter();
  const { data, isError, isLoading, refetch } = useQuery(
    clubQueries.openingRequests(),
  );
  const clubs = data?.clubs ?? [];

  if (isLoading) return <ClubOpeningRequestSection.Loading />;

  if (isError) {
    return <ClubOpeningRequestSection.Error onRetry={() => void refetch()} />;
  }

  if (clubs.length === 0) return <ClubOpeningRequestSection.Empty />;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(263px,1fr))] gap-4">
        {clubs.map((club) => (
          <ClubCard
            key={club.id}
            club={club}
            showMemberCount={false}
            onClick={() => router.push(`/club/${club.id}?pending=true`)}
          />
        ))}
      </div>
    </div>
  );
};

ClubOpeningRequestSection.Loading = ClubOpeningRequestSectionLoading;
ClubOpeningRequestSection.Error = ClubOpeningRequestSectionError;
ClubOpeningRequestSection.Empty = ClubOpeningRequestSectionEmpty;

export { ClubOpeningRequestSection };
