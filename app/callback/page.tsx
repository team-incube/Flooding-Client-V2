"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { instance } from "@/shared/api/instance";
import { TextButton } from "@/shared/ui/Button/TextButton";

type CallbackStatus = "loading" | "error";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didRun = useRef(false);
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const code = searchParams.get("code");

    if (!code) {
      setStatus("error");
      setErrorMessage("로그인 인증 코드가 없어요. 다시 로그인해주세요.");
      return;
    }

    (async () => {
      try {
        const { data } = await instance.post("/api/auth/callback", {
          code,
        });
        const accessToken = data.data?.accessToken ?? data.accessToken;

        if (!accessToken) {
          throw new Error("access token missing");
        }

        sessionStorage.setItem("access_token", accessToken);

        router.replace("/");
      } catch {
        setStatus("error");
        setErrorMessage("로그인 처리에 실패했어요. 다시 로그인해주세요.");
      }
    })();
  }, [router, searchParams]);

  if (status === "error") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex w-[360px] flex-col gap-4 rounded-2xl bg-background-surface p-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-title-3 text-main-text">로그인 실패</h1>
            <p className="text-text-3 text-sub-1">{errorMessage}</p>
          </div>
          <TextButton
            variant="filled"
            size="wide"
            onClick={() => router.replace("/signin")}
          >
            다시 로그인
          </TextButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="rounded-2xl bg-background-surface p-6 text-text-3 text-main-text">
        로그인 처리 중...
      </div>
    </div>
  );
}

export default function Callback() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background text-text-3 text-main-text">
          로딩 중...
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
