import { ClubDetailSection } from "@/features/club/ui/ClubDetailSection";

interface ClubDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { id } = await params;
  return <ClubDetailSection id={Number(id)} />;
}
