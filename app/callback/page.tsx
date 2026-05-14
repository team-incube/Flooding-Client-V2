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

        router.replace("/", { scroll: false });
      } catch {
        setStatus("error");
        setErrorMessage("로그인 처리에 실패했어요. 다시 로그인해주세요.");
      }
    })();
  }, [router, searchParams]);

  if (status === "error") {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center px-5">
        <div className="bg-background-surface flex w-full max-w-[380px] flex-col gap-5 rounded-2xl p-7 shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-none">
          <div className="flex flex-col gap-2">
            <h1 className="text-title-3 text-main-text">로그인 실패</h1>
            <p className="text-text-3 text-sub-1">{errorMessage}</p>
          </div>
          <TextButton
            variant="filled"
            size="fit"
            onClick={() => router.replace("/signin")}
          >
            다시 로그인
          </TextButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-3">
        <span className="bg-p-1 size-2.5 animate-pulse rounded-full" />
        <p className="text-title-3 text-main-text">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function Callback() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="bg-p-1 size-2.5 animate-pulse rounded-full" />
            <p className="text-text-3 text-main-text">로딩 중...</p>
          </div>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
