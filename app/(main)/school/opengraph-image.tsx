import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/shared/lib/og/renderOgImage";

export const runtime = "nodejs";
export const alt = "플러딩 - 학교";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    eyebrow: "학교",
    title: "학교생활을 더 편리하게",
    subtitle: "GSM 통합 관리 시스템, 플러딩",
  });
}
