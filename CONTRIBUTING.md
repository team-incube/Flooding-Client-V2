# 기여 가이드

Flooding-Client-V2에 기여해 주셔서 감사합니다. 이 문서는 기여 가이드와 릴리즈 절차를 안내합니다.

> [!IMPORTANT]
> 기여하기 전에 [행동 강령](./CODE_OF_CONDUCT.md)을 먼저 읽어 주세요. 모든 참여자는 이를 준수해야 합니다.

## 시작하기

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run type-check # 타입 검사
npm run format   # Prettier 포맷팅
```

프로젝트 개요·기술 스택·에이전트 자동화 규칙은 [`AGENTS.md`](./AGENTS.md)를 참고하세요.

## 규칙 문서

기여에 필요한 세부 규칙은 아래 문서에 정리되어 있습니다. 새 작업을 시작하기 전에 해당하는 문서를 확인해 주세요.

- 브랜치명·커밋 타입·메시지 규칙 → [`.claude/rules/commit-convention.md`](./.claude/rules/commit-convention.md)
- PR 제목·본문 형식 → [`.agents/pr-format.md`](./.agents/pr-format.md)
- FSD 디렉터리 구조와 레이어 import 규칙 → [`.claude/rules/architecture.md`](./.claude/rules/architecture.md)
- TypeScript/React 네이밍 및 코드 스타일 → [`.claude/rules/code-style.md`](./.claude/rules/code-style.md)
- 컴포넌트/props/variant/styling 규칙 → [`.claude/rules/component-convention.md`](./.claude/rules/component-convention.md)
- API client·query·서버 상태 규칙 → [`.claude/rules/api-convention.md`](./.claude/rules/api-convention.md)
- feature/entity/shared/widgets 구현 패턴 → [`.claude/rules/domain-patterns.md`](./.claude/rules/domain-patterns.md)
- auth/provider/theme/routes 전역 패턴 → [`.claude/rules/global-patterns.md`](./.claude/rules/global-patterns.md)
- 테스트 작성 기준 → [`.claude/rules/testing.md`](./.claude/rules/testing.md)

## 릴리즈

릴리즈는 `develop` → `main` PR로 진행하며 릴리즈 PR 제목은 한국 표준시(KST) 기준 **`vYYYY.MMDD.HHmm`** 형식을 사용합니다(예: `v2026.0611.0908`).

릴리즈 PR 본문 형식은 [`.agents/pr-format.md`](./.agents/pr-format.md)를 따릅니다.

릴리즈 노트 초안은 **Release Drafter** 워크플로우([`.github/workflows/release-drafter.yml`](./.github/workflows/release-drafter.yml))가 작성합니다.

### 릴리즈 노트 초안 트리거

릴리즈 노트 초안 생성은 **자동으로 실행되지 않으며** 권한을 가진 사람이 원하는 시점에 직접 트리거합니다.

**누가 트리거할 수 있나요?**

> [!NOTE]
> **OWNER**, **MEMBER**, **COLLABORATOR** 중 하나의 권한을 가진 경우 트리거할 수 있습니다.
> 외부 기여자(`CONTRIBUTOR`, `NONE` 등)가 명령 댓글을 달아도 워크플로우는 무시합니다.

**어떻게 트리거하나요?**

> [!TIP]
> **댓글 명령 (권장)** — 릴리즈 PR(`develop` → `main`)에 `/release-draft` 댓글을 답니다.
>
> - 버전을 직접 지정하려면 뒤에 버전을 붙입니다: `/release-draft 2.1.0`
> - 버전을 생략하면 직전 릴리즈 태그를 기준으로 **patch 버전이 자동 증가**합니다(예: `v2.0.5` → `v2.0.6`).
> - 실행이 끝나면 봇이 생성된 draft 릴리즈 링크를 해당 PR에 댓글로 회신합니다.

**Actions 탭** — `Actions → Release Drafter → Run workflow` 버튼으로도 실행할 수 있으며, 이때 `version` 입력란에 버전을 직접 넣을 수 있습니다.

**무엇이 일어나나요?**

- Release Drafter가 `main` 브랜치 커밋 히스토리를 기준으로 직전 릴리즈 이후 머지된 PR을 수집해 `What's Changed` 목록과 비교(diff) 링크를 자동 생성합니다.
- 결과는 **draft 릴리즈**로 생성/갱신됩니다(아직 발행되지 않음).
  - draft는 항상 하나만 유지·갱신되므로 같은 릴리즈에 PR이 더 머지되면 명령을 다시 실행해 목록을 갱신할 수 있습니다(여러 번 실행해도 결과는 동일).
- 릴리즈 PR 자신(`🪽 Type: Release` 라벨)은 변경 목록에서 제외됩니다.

**발행 전 마무리**

- draft 릴리즈의 `📝작업 내용` 영역에 이슈별 작업 내용을 한국어로 직접 채웁니다.
- 내용을 확인한 뒤 GitHub에서 **Publish**하여 태그와 릴리즈를 확정합니다.
