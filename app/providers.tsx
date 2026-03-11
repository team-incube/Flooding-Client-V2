"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OAuthProvider } from "@themoment-team/datagsm-oauth-react";
import { queryClient } from "@/shared/api/queryClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <OAuthProvider
        clientId={process.env.NEXT_PUBLIC_DG_CLIENT_ID!}
        redirectUri={process.env.NEXT_PUBLIC_DG_REDIRECT_URL!}
        authMode="PKCE"
      >
        {children}
      </OAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
} 