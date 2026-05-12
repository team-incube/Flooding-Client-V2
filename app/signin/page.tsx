"use client";

import { useState } from "react";
import Logo from "@/shared/asset/svg/Logo";
import { DataGsmLoginButton } from "@/shared/ui/Button/DataGsmLoginButton";
import { useOAuth } from "@themoment-team/datagsm-oauth-react";

export default function Signin() {
  const { login } = useOAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (isLoggingIn) {
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage("");

    try {
      await login();
    } catch {
      setErrorMessage("로그인을 시작하지 못했어요. 잠시 후 다시 시도해주세요.");
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="bg-background relative isolate flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 before:absolute before:inset-0 before:-z-20 before:bg-[linear-gradient(135deg,var(--background)_0%,var(--color-p-2)_52%,var(--background-surface)_100%)] after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(circle_at_20%_20%,var(--color-p-3)_0_1px,transparent_1px),radial-gradient(circle_at_78%_72%,var(--color-sub-3)_0_1px,transparent_1px)] after:bg-[length:34px_34px,48px_48px] after:opacity-45 dark:before:bg-[linear-gradient(135deg,var(--background)_0%,var(--color-p-2)_50%,var(--background-surface)_100%)] dark:after:opacity-25">
      <div className="absolute top-0 right-0 -z-10 h-[42vh] w-[42vw] min-w-[260px] bg-[radial-gradient(circle,var(--color-p-3)_0%,transparent_62%)] opacity-55 blur-3xl dark:opacity-35" />

      <section className="flex w-full max-w-[760px] flex-col items-center gap-9 text-center">
        <div>
          <Logo width={318} height={86} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-title-3 text-main-text">
            GSM 통합 관리 시스템
          </h1>
          <p className="text-text-3 text-sub-1 max-w-[430px]">
            동아리, 기숙사, 홈베이스 기능을 한 곳에서 사용할 수 있어요.
          </p>
        </div>

        <div className="flex min-h-[80px] w-full max-w-[330px] flex-col gap-3">
          <DataGsmLoginButton
            className="w-full"
            disabled={isLoggingIn}
            onClick={handleLogin}
          />
          {errorMessage && (
            <p className="text-caption-2 text-negative text-center">
              {errorMessage}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
