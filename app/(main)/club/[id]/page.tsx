import { ClubDetailSection } from "@/features/club/ui/ClubDetailSection";

interface ClubDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  return <ClubDetailSection params={params} />;
}
