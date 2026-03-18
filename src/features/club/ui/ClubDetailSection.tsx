import Club from "@/shared/asset/svg/Club";
import ClubDetail from "@/entities/club/ui/ClubDetail";
import { MOCK_CLUB_DETAILS } from "@/entities/club/model/mock";
import { notFound } from "next/navigation";

interface ClubDetailSectionProps {
  params: Promise<{
    id: string;
  }>;
}

export async function ClubDetailSection({ params }: ClubDetailSectionProps) {
  const { id } = await params;
  const clubId = Number(id);

  if (!Number.isInteger(clubId)) {
    notFound();
  }

  const detail = MOCK_CLUB_DETAILS[clubId];

  if (!detail) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 w-full overflow-y-auto xl:px-10 xl:pb-6 2xl:px-18 lg:px-8 sm:px-8">
      <div className="flex h-fit min-h-0 w-full flex-col gap-4 rounded-2xl bg-background-surface p-6">
        <div className="flex items-center gap-2">
          <Club isActive={false} size={20} />
          <span className="text-text-1 text-main-text">동아리</span>
        </div>
        <div className="w-full">
          <ClubDetail detail={detail} />
        </div>
      </div>
    </div>
  );
}
