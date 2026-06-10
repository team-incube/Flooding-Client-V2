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

interface ClubOgData {
  name: string | null;
  imageUrl: string | null;
}

/**
 * 동아리 상세 OG 데이터. 소셜 크롤러는 인증 토큰이 없으므로
 * 백엔드를 직접 호출하고, 실패 시 기본값으로 폴백한다.
 */
async function getClubOgData(id: string): Promise<ClubOgData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) return { name: null, imageUrl: null };

  try {
    const response = await fetch(`${baseUrl}/clubs/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return { name: null, imageUrl: null };

    const body = (await response.json()) as { data?: ClubDetailResponse };
    return {
      name: body.data?.club?.name ?? null,
      imageUrl: body.data?.club?.imageUrl ?? null,
    };
  } catch {
    return { name: null, imageUrl: null };
  }
}

/**
 * Satori가 원격 이미지를 직접 가져오지 못하는 경우를 대비해
 * 썸네일을 base64 데이터 URI로 미리 받아둔다. 실패 시 썸네일을 생략한다.
 */
async function getThumbnailDataUri(
  imageUrl: string | null,
): Promise<string | null> {
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl, { next: { revalidate: 3600 } });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: OgImageProps) {
  const { id } = await params;
  const { name, imageUrl } = await getClubOgData(id);
  const thumbnailUrl = await getThumbnailDataUri(imageUrl);

  return renderOgImage({
    eyebrow: "동아리",
    title: name ?? "동아리",
    subtitle: "GSM 통합 관리 시스템, 플러딩",
    thumbnailUrl: thumbnailUrl ?? undefined,
  });
}
