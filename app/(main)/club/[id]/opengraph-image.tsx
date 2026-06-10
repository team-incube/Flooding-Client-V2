import type { ClubDetailResponse } from "@/entities/club/model/club";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/shared/lib/og/renderOgImage";

export const runtime = "nodejs";
export const alt = "플러딩 - 동아리";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

interface OgImageProps {
  params: Promise<{ id: string }>;
}

/**
 * 동아리 상세 OG 이미지. 소셜 크롤러는 인증 토큰이 없으므로
 * 백엔드를 직접 호출하고, 실패 시 기본 "동아리" 라벨로 폴백한다.
 */
async function getClubName(id: string): Promise<string | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/clubs/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { data?: ClubDetailResponse };
    return body.data?.club?.name ?? null;
  } catch {
    return null;
  }
}

export default async function Image({ params }: OgImageProps) {
  const { id } = await params;
  const clubName = await getClubName(id);

  return renderOgImage({
    eyebrow: "동아리",
    title: clubName ?? "동아리",
    subtitle: "GSM 통합 관리 시스템, 플러딩",
  });
}
