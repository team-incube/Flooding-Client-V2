"use client";

import Logo from "@/shared/asset/svg/Logo";
import {
  generateCodeChallenge,
  generateCodeVerifier,
} from "@/shared/lib/verify-token";
import { TextButton } from "@/shared/ui/Button/TextButton";

// @themoment-team/datagsm-oauth-react SDK 사용예정
export default function Signin() {
  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    const state = crypto.randomUUID();

    sessionStorage.setItem("code_verifier", verifier);
    sessionStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DG_CLIENT_ID ?? "",
      redirect_uri: process.env.NEXT_PUBLIC_DG_REDIRECT_URL ?? "",
      response_type: "code",
      code_challenge: challenge,
      code_challenge_method: "S256",
      state,
    });

    window.location.href = `${process.env.NEXT_PUBLIC_DG_AUTHORIZATION_URL}/v1/oauth/authorize?${params}`;
  };

  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-background">
      <div className="flex flex-col items-center gap-6 w-fit h-fit bg-background-surface px-8 py-13 rounded-2xl">
        <Logo />
        <TextButton variant="filled" size="wide" onClick={handleLogin}>
          Data GSM으로 로그인
        </TextButton>
      </div>
    </div>
  );
}
