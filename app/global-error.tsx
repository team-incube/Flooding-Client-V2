"use client";

import "@sun-typeface/suit/fonts/variable/woff2/SUIT-Variable.css";
import "./globals.css";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="bg-background flex min-h-screen items-center justify-center px-5">
          <div className="bg-background-surface flex w-full max-w-[380px] flex-col gap-5 rounded-2xl p-7">
            <div className="flex flex-col gap-2">
              <h1 className="text-title-3 text-main-text">
                예상치 못한 오류가 발생했어요
              </h1>
              <p className="text-text-3 text-sub-1">
                잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게
                문의해주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="bg-p-1 text-text-3 cursor-pointer rounded-xl px-4 py-2.5 font-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
