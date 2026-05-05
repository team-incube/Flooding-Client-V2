import { notFound } from "next/navigation";
import { ClubFormCreateSectionBoundary } from "@/features/club/ui/ClubFormCreateSection";

interface ClubFormCreatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClubFormCreatePage({
  params,
}: ClubFormCreatePageProps) {
  const { id } = await params;
  const clubId = Number(id);

  if (!Number.isInteger(clubId)) {
    notFound();
  }

  return <ClubFormCreateSectionBoundary id={clubId} />;
}
