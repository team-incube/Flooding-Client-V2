import { ImageResponse } from "next/og";

import Logo from "@/shared/asset/svg/Logo";

import { loadOgFonts, OG_FONT_FAMILY } from "./loadOgFonts";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const COLOR_BACKGROUND = "#f7f7f9";
const COLOR_SURFACE = "#fdfdfd";
const COLOR_POINT = "#6f7aec";
const COLOR_MAIN_TEXT = "#292e3d";
const COLOR_SUB_TEXT = "#656b80";

interface RenderOgImageOptions {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/**
 * 플러딩 브랜드 OG 이미지를 1200×630 PNG로 렌더링한다.
 */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: RenderOgImageOptions): Promise<ImageResponse> {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: COLOR_BACKGROUND,
        padding: "80px",
        fontFamily: OG_FONT_FAMILY,
      }}
    >
      <Logo height={78} fill={COLOR_POINT} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              backgroundColor: COLOR_SURFACE,
              color: COLOR_POINT,
              border: `2px solid ${COLOR_POINT}`,
              borderRadius: "9999px",
              padding: "8px 24px",
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "24px",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            color: COLOR_MAIN_TEXT,
            fontSize: "84px",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              color: COLOR_SUB_TEXT,
              fontSize: "36px",
              fontWeight: 400,
              marginTop: "24px",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: fonts.map(({ name, data, weight, style }) => ({
        name,
        data,
        weight,
        style,
      })),
    },
  );
}
