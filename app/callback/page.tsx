"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useOAuth } from "@themoment-team/datagsm-oauth-react";
import { instance } from "@/shared/api/instance";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCodeVerifier, clearVerifier } = useOAuth();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const code = searchParams.get("code");

    if (!code) {
      router.replace("/signin");
      return;
    }

    const codeVerifier = getCodeVerifier();

    (async () => {
      try {
        const { data } = await instance.post("/api/auth/callback", {
          code,
          codeVerifier,
        });
        const { accessToken, user } = data;

        sessionStorage.setItem("access_token", accessToken);
        sessionStorage.setItem("user", JSON.stringify(user));
        clearVerifier();

        router.replace("/");
      } catch {
        router.replace("/signin");
      }
    })();
  }, [router, searchParams, getCodeVerifier, clearVerifier]);

  return <div>로그인 처리 중...</div>;
}

export default function Callback() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CallbackInner />
    </Suspense>
  );
}
