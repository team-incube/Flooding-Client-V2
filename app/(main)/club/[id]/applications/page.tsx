import { notFound } from "next/navigation";
import { ClubApplicationListSection } from "@/features/club/ui/ClubApplicationListSection";

interface ClubApplicationsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClubApplicationsPage({
  params,
}: ClubApplicationsPageProps) {
  const { id } = await params;
  const clubId = Number(id);

  if (!Number.isInteger(clubId)) {
    notFound();
  }

  return <ClubApplicationListSection id={clubId} />;
}
