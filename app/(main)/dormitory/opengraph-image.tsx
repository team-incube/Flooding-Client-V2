import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/shared/lib/og/renderOgImage";

export const runtime = "nodejs";
export const alt = "플러딩 - 기숙사";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "기숙사",
    title: "기숙사 생활을 한 곳에서",
    subtitle: "자습 관리 · 안마의자 예약 · 기상음악 신청",
  });
}
