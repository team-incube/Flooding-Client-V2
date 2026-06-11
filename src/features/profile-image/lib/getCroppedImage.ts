import type { Area } from "react-easy-crop";

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

  const width = Math.round(area.width);
  const height = Math.round(area.height);
  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    Math.round(area.x),
    Math.round(area.y),
    width,
    height,
    0,
    0,
    width,
    height,
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("이미지 변환에 실패했습니다."));
        return;
      }
      resolve(new File([blob], "profile.png", { type: "image/png" }));
    }, "image/png");
  });
}
