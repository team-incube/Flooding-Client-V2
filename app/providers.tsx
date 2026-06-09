"use client";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OAuthProvider } from "@themoment-team/datagsm-oauth-react";
import * as Sentry from "@sentry/nextjs";
import { Toaster } from "sonner";
import { queryClient } from "@/shared/api/queryClient";
import { refreshAccessToken } from "@/shared/api/instance";
import { userQueries } from "@/entities/user/api/userQueries";
import type { User } from "@/entities/user/model/user";
import { MSWProvider } from "./msw-provider";

/**
 * 앱 진입 시 access_token이 없으면(탭 종료/새로고침 등으로 sessionStorage 소멸)
 * refresh_token 쿠키로 선제 복구한다. 렌더링은 막지 않으며, 인터셉터와 동일한
 * refresh 프로미스를 공유하므로 중복 호출이 발생하지 않는다.
 */
function SessionRestorer() {
  useEffect(() => {
    if (sessionStorage.getItem("access_token")) return;
    refreshAccessToken().catch(() => {
      // refresh_token 없음/만료 → 인터셉터가 401 시 /signin 처리
    });
  }, []);

  return null;
}

function SentryUserBridge() {
  useEffect(() => {
    const { queryKey } = userQueries.me();

    const sync = () => {
      const user = queryClient.getQueryData<User>(queryKey);
      if (!user?.id) {
        Sentry.setUser(null);
        return;
      } else {
        Sentry.setUser({
          id: String(user.id),
          username: user.name,
        });
      }
    };

    const targetHash = queryClient
      .getQueryCache()
      .find({ queryKey })?.queryHash;

    sync();

    return queryClient.getQueryCache().subscribe((event) => {
      if (event.type !== "updated") return;
      if (event.query.queryHash !== targetHash) return;
      sync();
    });
  }, []);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <QueryClientProvider client={queryClient}>
        <SentryUserBridge />
        <SessionRestorer />
        <OAuthProvider
          clientId={process.env.NEXT_PUBLIC_DG_CLIENT_ID!}
          redirectUri={process.env.NEXT_PUBLIC_DG_REDIRECT_URL!}
          authMode="STANDARD"
        >
          {children}
        </OAuthProvider>
        <Toaster richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MSWProvider>
  );
}
