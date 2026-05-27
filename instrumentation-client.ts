import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  sendDefaultPii: false,
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications.",
    "Non-Error promise rejection captured",
  ],
  beforeSend(event) {
    if (event.request?.headers && "Authorization" in event.request.headers) {
      event.request.headers.Authorization = "[REDACTED]";
    }
    if (event.request?.url?.includes("access_token")) {
      event.request.url = event.request.url.replace(
        /access_token=[^&]+/g,
        "access_token=[REDACTED]",
      );
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
