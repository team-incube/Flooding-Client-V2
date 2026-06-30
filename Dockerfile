# syntax=docker/dockerfile:1

# ---- deps: install dependencies ----
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: build Next.js (standalone) ----
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* are inlined at build time, so they must be provided here.
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DG_CLIENT_ID
ARG NEXT_PUBLIC_DG_REDIRECT_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SENTRY_DSN
# Build-time only: Sentry source map upload.
ARG SENTRY_AUTH_TOKEN

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_DG_CLIENT_ID=$NEXT_PUBLIC_DG_CLIENT_ID \
    NEXT_PUBLIC_DG_REDIRECT_URL=$NEXT_PUBLIC_DG_REDIRECT_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- runner: minimal runtime image ----
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# yt-dlp
ADD https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

RUN groupadd -r nodejs && useradd -r -g nodejs nextjs

# public assets + standalone server + static chunks
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# standalone output entrypoint (NOT `next start`)
CMD ["node", "server.js"]
