# GSM SV 배포 가이드

Flooding 프론트엔드를 GSM SV(Ubuntu VM)에 Docker 로 배포한다. Vercel 서버리스 → 자체 VM 전환.

## 구성

- **Next.js standalone** 이미지(멀티스테이지 `Dockerfile`)를 GHCR 에 올리고 VM 에서 pull.
- VM 에서 `docker compose` 로 **app + nginx** 구동. nginx 가 80(추후 443)을 받아 `app:3000` 으로 프록시.
- app 은 외부로 직접 노출하지 않는다(`expose: 3000`).

## 환경변수 두 종류

| 종류 | 예 | 주입 시점 |
|---|---|---|
| `NEXT_PUBLIC_*` (공개, 번들 인라인) | BASE_URL, DG_CLIENT_ID, DG_REDIRECT_URL, SITE_URL, SENTRY_DSN | **빌드 시 `--build-arg`** |
| `SENTRY_AUTH_TOKEN` (소스맵 업로드) | — | **빌드 시만** |
| 서버 시크릿 | `YOUTUBE_API_KEY`, 서버 `SENTRY_DSN` | **런타임** (`.env`) |

> `NEXT_PUBLIC_*` 는 빌드에 박히므로 환경(dev/prod)별로 redirect/site URL 을 바꿔 **각각 빌드**한다(태그 분리).

## 1. 이미지 빌드 & 푸시 (amd64 필수)

VM 은 amd64 다. arm64 호스트(Apple Silicon)에서 빌드 시 반드시 `--platform linux/amd64`.

```bash
docker login ghcr.io -u <github-user>     # PAT(write:packages)
docker buildx build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_BASE_URL=... \
  --build-arg NEXT_PUBLIC_DG_CLIENT_ID=... \
  --build-arg NEXT_PUBLIC_DG_REDIRECT_URL=... \
  --build-arg NEXT_PUBLIC_SITE_URL=... \
  --build-arg NEXT_PUBLIC_SENTRY_DSN=... \
  --build-arg SENTRY_AUTH_TOKEN=... \
  -t ghcr.io/team-incube/flooding-client:develop --push .
```

## 2. dev 배포 (HTTP)

```bash
# VM 에 docker/compose 설치 (curl -fsSL https://get.docker.com | sudo sh)
# compose.yaml, nginx/, .env 를 VM 작업 디렉터리로 전송
cp .env.example .env        # COOKIE_SECURE=false, YOUTUBE_API_KEY, SENTRY_DSN 채움. SERVER_NAME=_
docker login ghcr.io -u <github-user>
docker compose pull && docker compose up -d
docker compose logs -f
```

- 포트포워딩 환경(`ssh.gsmsv.site:PORT`)에서는 `COOKIE_SECURE=false` 가 있어야 평문 HTTP 에서 refresh_token 쿠키가 저장된다.
- OAuth 가 동작하려면 DataGSM 에 redirect URL(예: `http://ssh.gsmsv.site:22142/callback`)이 등록돼 있어야 한다.

## 3. prod 배포 (HTTPS) — 후속

전제: flooding.kr 공인 IP 할당(GSM SV, DevOps 협의) + DNS A레코드 → 공인 IP + 80/443 오픈.

```bash
# .env: SERVER_NAME=flooding.kr, IMAGE_TAG=main, COOKIE_SECURE 제거(또는 true)
# compose.yaml: nginx 443 포트 주석 해제
docker compose --profile prod up -d nginx app
docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d flooding.kr
# nginx/tls/app.tls.conf.template.example → nginx/templates/default.conf.template 로 교체, <DOMAIN> 치환
docker compose --profile prod up -d --force-recreate
```

certbot 서비스(prod 프로파일)가 인증서를 12시간마다 자동 갱신한다.

## 트러블슈팅

- **`exec format error`**: 이미지 아키텍처 불일치. amd64 로 빌드했는지 확인.
- **로그인 후 무한 /signin**: `COOKIE_SECURE` 미설정(HTTP). dev 는 `false`.
- **SSE 끊김/지연**: nginx `proxy_buffering off`·`proxy_read_timeout` 적용 확인(템플릿에 포함됨).
- **OG 폰트 깨짐**: standalone 에 폰트 누락. `next.config.ts` 의 `outputFileTracingIncludes` 확인.
