import type { Area } from "react-easy-crop";

// 아바타는 최대 72px(@2x≈144px)로 표시되므로 원본을 그대로 저장할 필요가 없다.
// 한 변을 512px로 제한하고 WebP로 압축해 저장·전송 용량을 크게 줄인다.
const MAX_OUTPUT_SIZE = 512;
const OUTPUT_QUALITY = 0.85;

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = url;
  });
}

export async function getCroppedImage(
  imageSrc: string,
  area: Area,
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 컨텍스트를 가져올 수 없습니다.");

  const cropWidth = Math.round(area.width);
  const cropHeight = Math.round(area.height);
  const scale = Math.min(1, MAX_OUTPUT_SIZE / Math.max(cropWidth, cropHeight));
  const outputWidth = Math.round(cropWidth * scale);
  const outputHeight = Math.round(cropHeight * scale);

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    Math.round(area.x),
    Math.round(area.y),
    cropWidth,
    cropHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("이미지 변환에 실패했습니다."));
          return;
        }
        resolve(new File([blob], "profile.webp", { type: "image/webp" }));
      },
      "image/webp",
      OUTPUT_QUALITY,
    );
  });
}
