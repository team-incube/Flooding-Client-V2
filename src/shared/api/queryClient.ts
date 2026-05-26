import {
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { captureFeatureError } from "@/shared/lib/sentry";

const MINUTE = 60 * 1000;

function shouldReport(error: unknown) {
  if (!axios.isAxiosError(error)) return true;
  const status = error.response?.status ?? 0;
  return status === 0 || status >= 500;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (shouldReport(error)) {
        captureFeatureError(error, {
          feature: "react-query",
          action: "query",
          extras: { queryKey: query.queryKey },
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (shouldReport(error)) {
        captureFeatureError(error, {
          feature: "react-query",
          action: "mutation",
          extras: { mutationKey: mutation.options.mutationKey },
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: MINUTE,
      gcTime: 60 * MINUTE,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
