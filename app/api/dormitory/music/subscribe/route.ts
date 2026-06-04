import type { NextRequest } from "next/server";
import { proxySse } from "@/shared/api/sseProxy";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  return proxySse(request, "/dormitory/music/subscribe");
}
