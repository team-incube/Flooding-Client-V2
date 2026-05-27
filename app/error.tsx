"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { TextButton } from "@/shared/ui/Button/TextButton";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-5">
      <div className="bg-background-surface flex w-full max-w-[380px] flex-col gap-5 rounded-2xl p-7 shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-none">
        <div className="flex flex-col gap-2">
          <h1 className="text-title-3 text-main-text">
            예상치 못한 오류가 발생했어요
          </h1>
          <p className="text-text-3 text-sub-1">
            잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의해주세요.
          </p>
        </div>
        <TextButton variant="filled" size="fit" onClick={reset}>
          다시 시도
        </TextButton>
      </div>
    </div>
  );
}
