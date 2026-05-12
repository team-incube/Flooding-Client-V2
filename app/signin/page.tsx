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
    <div className="bg-background flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="bg-background-surface flex min-h-[430px] w-full max-w-[480px] flex-col items-center justify-center gap-10 rounded-2xl px-8 py-12 shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:shadow-none">
        <div className="flex flex-col items-center gap-8">
          <Logo width={265} height={72} />
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-title-1 text-main-text">로그인</h1>
            <p className="text-text-3 text-sub-1">GSM 통합 관리 시스템</p>
          </div>
        </div>
        <div className="flex min-h-[62px] flex-col items-center gap-3">
          <DataGsmLoginButton disabled={isLoggingIn} onClick={handleLogin} />
          {errorMessage && (
            <p className="text-caption-2 text-negative w-[330px] text-center">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
