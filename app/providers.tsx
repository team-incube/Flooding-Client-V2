"use client";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OAuthProvider } from "@themoment-team/datagsm-oauth-react";
import * as Sentry from "@sentry/nextjs";
import { Toaster } from "sonner";
import { queryClient } from "@/shared/api/queryClient";
import { userQueries } from "@/entities/user/api/userQueries";
import type { User } from "@/entities/user/model/user";
import { MSWProvider } from "./msw-provider";

function SentryUserBridge() {
  useEffect(() => {
    const sync = () => {
      const user = queryClient.getQueryData<User>(userQueries.me().queryKey);
      if (!user?.id) {
        Sentry.setUser(null);
        return;
      }
      Sentry.setUser({
        id: String(user.id),
        username: user.name,
      });
    };

    sync();
    return queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === "user" && event.query.queryKey[1] === "me") {
        sync();
      }
    });
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <QueryClientProvider client={queryClient}>
        <SentryUserBridge />
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
