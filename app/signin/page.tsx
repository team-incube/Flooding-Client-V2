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
    <main className="bg-background flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <section className="bg-background-surface flex h-fit w-fit flex-col items-center gap-6 rounded-2xl px-15 py-15">
        <div className="flex flex-col items-center gap-2">
          <Logo />
          <p className="text-text-3 text-sub-1">
            하나의 플랫폼, 학교 통합 관리 서비스
          </p>
        </div>

        <div className="flex w-full max-w-[330px] flex-col items-center gap-3">
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
