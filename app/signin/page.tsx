"use client";

import Logo from "@/shared/asset/svg/Logo";
import { TextButton } from "@/shared/ui/Button/TextButton";
import { useOAuth } from "@themoment-team/datagsm-oauth-react";

export default function Signin() {
  const { login } = useOAuth();

  const handleLogin = async () => {
    await login();
  };

  return (
    <div className="bg-background flex h-screen items-center justify-center overflow-hidden">
      <div className="bg-background-surface flex h-fit w-fit flex-col items-center gap-6 rounded-2xl px-8 py-13">
        <Logo />
        <TextButton variant="filled" size="wide" onClick={handleLogin}>
          Data GSM으로 로그인
        </TextButton>
      </div>
    </div>
  );
}
