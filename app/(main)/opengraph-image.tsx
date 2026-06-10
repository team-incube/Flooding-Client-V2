import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  renderOgImage,
} from "@/shared/lib/og/renderOgImage";

export const runtime = "nodejs";
export const alt = "플러딩 - GSM 통합 관리 시스템";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    title: "플러딩",
    subtitle: "GSM의 학교생활과 기숙사 생활을 하나로",
  });
}
