import { instance } from "@/shared/api/instance";
import { HttpStatusCode } from "axios";

const EXCEL_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function getDownloadFileName(contentDisposition?: string): string {
  if (!contentDisposition) return "동아리_명단.xlsx";

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) return decodeURIComponent(utf8Match[1]);

  const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return fileNameMatch?.[1] ?? "동아리_명단.xlsx";
}

export async function exportClubs(): Promise<void> {
  const response = await instance.get<ArrayBuffer>("/clubs/export", {
    responseType: "arraybuffer",
    headers: { Accept: EXCEL_MIME_TYPE },
  });

  if (
    response.status === HttpStatusCode.NoContent ||
    response.data.byteLength === 0
  ) {
    throw new Error("다운로드할 동아리 데이터가 없습니다.");
  }

  const fileName = getDownloadFileName(
    response.headers["content-disposition"],
  );
  const blob = new Blob([response.data], {
    type: String(response.headers["content-type"] ?? EXCEL_MIME_TYPE),
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
