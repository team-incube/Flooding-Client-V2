"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      router.replace("/signin");
      return;
    }

    const savedState = sessionStorage.getItem("oauth_state");
    if (state !== savedState) {
      router.replace("/signin");
      return;
    }

    const codeVerifier = sessionStorage.getItem("code_verifier");

    (async () => {
      const res = await fetch("/api/auth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, codeVerifier }),
      });

      if (!res.ok) {
        router.replace("/signin");
        return;
      }

      const { accessToken, user } = await res.json();

      sessionStorage.setItem("access_token", accessToken);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("code_verifier");
      sessionStorage.removeItem("oauth_state");

      router.replace("/");
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
