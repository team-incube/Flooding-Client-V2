import { readFile } from "fs/promises";
import { fileURLToPath } from "url";

export const OG_FONT_FAMILY = "SUIT";

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
}

let cachedFonts: Promise<OgFont[]> | null = null;

async function readFontFile(fileName: string): Promise<ArrayBuffer> {
  const fontPath = fileURLToPath(
    new URL(`./fonts/${fileName}`, import.meta.url),
  );
  const buffer = await readFile(fontPath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

export function loadOgFonts(): Promise<OgFont[]> {
  if (!cachedFonts) {
    cachedFonts = Promise.all([
      readFontFile("SUIT-Regular.ttf"),
      readFontFile("SUIT-Bold.ttf"),
    ]).then(([regular, bold]) => [
      { name: OG_FONT_FAMILY, data: regular, weight: 400, style: "normal" },
      { name: OG_FONT_FAMILY, data: bold, weight: 700, style: "normal" },
    ]);
  }

  return cachedFonts;
}
