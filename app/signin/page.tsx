"use client";

import {
  generateCodeChallenge,
  generateCodeVerifier,
} from "@/shared/lib/verify-token";

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
    <div>
      <button onClick={handleLogin}>DATA GSM으로 로그인</button>
    </div>
  );
}
