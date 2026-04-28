import { notFound } from "next/navigation";
import { ClubFormEditSection } from "@/features/club/ui/ClubFormEditSection";

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

  return <ClubFormEditSection id={clubId} />;
}
