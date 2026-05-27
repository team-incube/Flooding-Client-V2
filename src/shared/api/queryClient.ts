import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import * as Sentry from "@sentry/nextjs";
import {
  captureFeatureAnomaly,
  captureFeatureError,
} from "@/shared/lib/sentry";
import {
  axiosResponseSchema,
  getMutationContext,
  mutationMonitorMetaSchema,
} from "./axiosLogSchema";

const MINUTE = 60 * 1000;

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!axios.isAxiosError(error) || !error.response || error.response.status >= 500) {
        captureFeatureError(error, {
          feature: "react-query",
          action: "query",
          extras: { queryKey: query.queryKey },
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onMutate: (variables, mutation) => {
      const context = getMutationContext(mutation.options.mutationKey);
      if (!context) return;

      const parsedMeta = mutationMonitorMetaSchema.safeParse(mutation.options.meta);
      const meta = parsedMeta.success ? parsedMeta.data : undefined;

      Sentry.addBreadcrumb({
        category: context.feature,
        message: context.action,
        level: "info",
        data: meta?.getExtras?.(variables) ?? {},
      });
    },
    onSuccess: (data, variables, _context, mutation) => {
      const parsedData = axiosResponseSchema.safeParse(data);
      if (!parsedData.success) return;
      const responseData = parsedData.data;

      if (responseData.status === HttpStatusCode.NoContent) return;
      if (responseData.status < 200 || responseData.status >= 300) return;
      if (responseData.data !== null && responseData.data !== undefined) return;

      const context = getMutationContext(mutation.options.mutationKey);
      const parsedMeta = mutationMonitorMetaSchema.safeParse(mutation.options.meta);
      const meta = parsedMeta.success ? parsedMeta.data : undefined;

      captureFeatureAnomaly({
        feature: context?.feature ?? "unknown",
        action: context?.action ?? "mutation",
        anomaly: "empty-2xx-response",
        message: "Mutation: 2xx 응답이지만 본문이 비어있음(204 제외)",
        api: {
          status: responseData.status,
          url: responseData.config?.url,
          method: responseData.config?.method,
        },
        extras: meta?.getExtras?.(variables),
      });
    },
    onError: (error, variables, _context, mutation) => {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status < 500
      ) {
        return;
      }

      const parsedMeta = mutationMonitorMetaSchema.safeParse(mutation.options.meta);
      const meta = parsedMeta.success ? parsedMeta.data : undefined;
      const context = getMutationContext(mutation.options.mutationKey);

      if (context) {
        captureFeatureError(error, {
          feature: context.feature,
          action: context.action,
          extras: meta?.getExtras?.(variables),
        });
        return;
      }

      captureFeatureError(error, {
        feature: "react-query",
        action: "mutation",
        extras: { mutationKey: mutation.options.mutationKey },
      });
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
