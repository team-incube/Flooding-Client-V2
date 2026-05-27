import { notFound } from "next/navigation";
import { ClubApplicationSectionBoundary } from "@/features/club-application/ui/ClubApplicationSection";

interface ClubApplyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClubApplyPage({ params }: ClubApplyPageProps) {
  const { id } = await params;
  const clubId = Number(id);

  if (!Number.isInteger(clubId)) {
    notFound();
  }

  return <ClubApplicationSectionBoundary id={clubId} />;
}
