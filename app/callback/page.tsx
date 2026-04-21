"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { instance } from "@/shared/api/instance";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didRun = useRef(false);
  const [responseBody, setResponseBody] = useState<unknown>(null);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const code = searchParams.get("code");

    console.log(code);

    if (!code) {
      router.replace("/signin");
      return;
    }

    (async () => {
      try {
        const { data } = await instance.post("/api/auth/callback", {
          code,
        });

        setResponseBody(data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setResponseBody(error.response.data);
          return;
        }

        setResponseBody({ error: String(error) });
      }
    })();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-background p-6 text-main-text">
      <pre className="whitespace-pre-wrap wrap-break-word rounded-lg bg-background-surface p-4 text-text-2">
        {responseBody === null
          ? "로그인 처리 중..."
          : JSON.stringify(responseBody, null, 2)}
      </pre>
    </main>
  );
}

export default function Callback() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CallbackInner />
    </Suspense>
  );
}
