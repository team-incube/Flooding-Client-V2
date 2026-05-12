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
      <section className="bg-background-surface grid w-full max-w-[960px] overflow-hidden rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:grid-cols-[1.08fr_0.92fr] dark:shadow-none">
        <div className="bg-p-2 dark:bg-p-3 flex min-h-[280px] flex-col justify-between gap-8 px-8 py-8 md:min-h-[520px] md:px-10 md:py-10">
          <Logo width={260} height={71} />
          <div className="flex max-w-[360px] flex-col gap-4">
            <p className="text-text-2 text-p-1">GSM 통합 관리 시스템</p>
            <h1 className="text-main-text text-title-1">
              학교생활과 기숙사 생활을
              <br />한 곳에서 시작하세요
            </h1>
            <p className="text-sub-1 text-text-3">
              동아리 개설부터 자습 관리, 안마의자 예약, 기상음악 신청과 AI
              기능까지 플러딩에서 통합해 관리합니다.
            </p>
          </div>
        </div>

        <div className="flex min-h-[320px] items-center justify-center px-6 py-8 md:min-h-[520px] md:px-10">
          <div className="flex w-full max-w-[330px] flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-title-2 text-main-text">로그인</h2>
              <p className="text-text-3 text-sub-1">
                DataGSM 계정으로 안전하게 접속합니다.
              </p>
            </div>

            <div className="flex min-h-[78px] flex-col gap-3">
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
          </div>
        </div>
      </section>
    </main>
  );
}
