import { QueryClient } from "@tanstack/react-query";

const MINUTE = 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * MINUTE,
      gcTime: 60 * MINUTE,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    }
  }
});