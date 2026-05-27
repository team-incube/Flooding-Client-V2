import { notFound } from "next/navigation";
import { ClubFormEditSectionBoundary } from "@/features/club-form/ui/ClubFormEditSection";

interface ClubFormEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClubFormEditPage({
  params,
}: ClubFormEditPageProps) {
  const { id } = await params;
  const clubId = Number(id);

  if (!Number.isInteger(clubId)) {
    notFound();
  }

  return <ClubFormEditSectionBoundary id={clubId} />;
}
