import * as Sentry from "@sentry/nextjs";
import axios from "axios";

interface CaptureFeatureErrorOptions {
  feature: string;
  action: string;
  extras?: Record<string, unknown>;
}

export function captureFeatureError(
  error: unknown,
  { feature, action, extras }: CaptureFeatureErrorOptions,
) {
  Sentry.withScope((scope) => {
    scope.setTag("feature", feature);
    scope.setTag("action", action);

    if (axios.isAxiosError(error)) {
      scope.setTag("http.status", String(error.response?.status ?? "unknown"));
      scope.setContext("api", {
        method: error.config?.method,
        url: error.config?.url,
        status: error.response?.status,
      });
    }

    if (extras) {
      scope.setContext("extras", extras);
    }

    Sentry.captureException(error);
  });
}

interface CaptureFeatureAnomalyOptions {
  feature: string;
  action: string;
  anomaly: string;
  message: string;
  extras?: Record<string, unknown>;
  api?: Record<string, unknown>;
}

export function captureFeatureAnomaly({
  feature,
  action,
  anomaly,
  message,
  extras,
  api,
}: CaptureFeatureAnomalyOptions) {
  Sentry.withScope((scope) => {
    scope.setLevel("warning");
    scope.setTag("feature", feature);
    scope.setTag("action", action);
    scope.setTag("anomaly", anomaly);

    if (api) scope.setContext("api", api);
    if (extras) scope.setContext("extras", extras);

    Sentry.captureMessage(message);
  });
}
