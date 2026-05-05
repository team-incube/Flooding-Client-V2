import { ClubDetailSection } from "@/features/club/ui/ClubDetailSection";

interface ClubDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pending?: string }>;
}

export default async function ClubDetailPage({ params, searchParams }: ClubDetailPageProps) {
  const { id } = await params;
  const { pending } = await searchParams;
  return <ClubDetailSection id={Number(id)} isPending={pending === "true"} />;
}
