"use client";

import { useState } from "react";
import Logo from "@/shared/asset/svg/Logo";
import { TextButton } from "@/shared/ui/Button/TextButton";
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
    <div className="bg-background flex h-screen items-center justify-center overflow-hidden">
      <div className="bg-background-surface flex h-fit w-fit flex-col items-center gap-6 rounded-2xl px-8 py-13">
        <Logo />
        <div className="flex flex-col items-center gap-3">
          <TextButton
            variant={isLoggingIn ? "disabled" : "filled"}
            size="wide"
            disabled={isLoggingIn}
            onClick={handleLogin}
          >
            {isLoggingIn ? "로그인 중" : "Data GSM으로 로그인"}
          </TextButton>
          {errorMessage && (
            <p className="w-[330px] text-center text-caption-2 text-negative">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
