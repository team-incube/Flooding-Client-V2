import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { extractYoutubeVideoId } from "@/entities/music/lib/youtube";
import { getYoutubeTranscript } from "@/entities/music/lib/transcript";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!accessToken) {
    return NextResponse.json(
      { error: "access token 없음" },
      { status: HttpStatusCode.Unauthorized },
    );
  }

  const params = request.nextUrl.searchParams;
  const urlParam = params.get("url");
  const idParam = params.get("id");
  const videoId =
    idParam ?? (urlParam ? extractYoutubeVideoId(urlParam) : null);

  if (!videoId) {
    return NextResponse.json(
      { error: "videoId(id) 또는 url이 필요합니다." },
      { status: HttpStatusCode.BadRequest },
    );
  }

  const result = await getYoutubeTranscript(videoId);

  if ("error" in result) {
    return NextResponse.json(result, { status: HttpStatusCode.NotFound });
  }

  return NextResponse.json(result);
}
