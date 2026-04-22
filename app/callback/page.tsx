"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { instance } from "@/shared/api/instance";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const code = searchParams.get("code");

    if (!code) {
      router.replace("/signin");
      return;
    }

    (async () => {
      try {
        const { data } = await instance.post("/api/auth/callback", {
          code,
        });
        const accessToken = data.data?.accessToken ?? data.accessToken;

        sessionStorage.setItem("access_token", accessToken);

        router.replace("/");
      } catch {
        router.replace("/signin");
      }
    })();
  }, [router, searchParams]);

  return <div>로그인 처리 중...</div>;
}

export default function Callback() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CallbackInner />
    </Suspense>
  );
}
