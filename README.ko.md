# HarnessMart

[English](README.md) · **한국어**

> 한국과 일본의 에이전트 퍼스트 엔지니어링 팀을 위한 하네스 라이브러리.
> 모든 에이전트. 모든 워크플로우. 하나의 명령어.

---

## 하네스란?

하네스 없는 AI 에이전트는 백지 상태입니다 — 능력은 있지만 방향이 없습니다.
**하네스**는 에이전트의 액션 스페이스, 도메인 전문성, 행동 가이드라인,
그리고 거버넌스 규칙을 정의합니다. *조직에서 일이 어떻게 처리되는지*를 인코딩합니다.

```
하네스 없이:  에이전트는 코딩할 줄 압니다. 팀의 기준을 모릅니다.
하네스 있이:  에이전트가 최고의 엔지니어처럼 코딩하고, 리뷰하고, 배포합니다.
```

HarnessMart는 하네스 라이브러리입니다 — 한국, 일본, 글로벌 최고의 엔지니어링 문화를
인코딩하여 하나의 명령어로 배포 가능하게 만들었습니다.

---

## 스택

HarnessMart는 4계층 에이전트 인프라 스택의 정의 계층에 위치합니다.
다른 모든 계층에서는 최고의 오픈소스 도구를 사용합니다.

```
┌─────────────────────────────────────────────────────────┐
│  HARNESMART  (이 프로젝트)                               │
│  하네스 라이브러리 · 회사 템플릿 · KR/JP 커뮤니티        │
├─────────────────────────────────────────────────────────┤
│  HaC CLI  (이 프로젝트)                                  │
│  harness define · build · validate · deploy             │
├─────────────────────────────────────────────────────────┤
│  OpenHarness  github.com/HKUDS/OpenHarness  ★6.4k       │
│  에이전트 런타임 · 43개 도구 · 프로바이더 라우팅 · 메모리  │
├─────────────────────────────────────────────────────────┤
│  Paperclip  github.com/paperclipai/paperclip  ★48.8k    │
│  조직도 · 목표 · 예산 · 거버넌스                          │
├─────────────────────────────────────────────────────────┤
│  LLM                                                    │
│  Claude · GPT-5 · Codex · HyperCLOVA X · EXAONE        │
└─────────────────────────────────────────────────────────┘
```

정의 계층과 라이브러리 계층을 만듭니다.
OpenHarness나 Paperclip과 경쟁하지 않습니다 — 런타임과 오케스트레이션 인프라를
구축해 주신 두 팀에 깊이 감사드립니다.

---

## 빠른 시작

```bash
# 설치
npm install -g harness-cli

# 사용 가능한 하네스 목록
harness list

# Toss 스타일 기능 개발 하네스를 OpenHarness에 배포
harness deploy harnesses/engineering/feature-dev/toss.yaml --target openharness

# Claude Code에 배포
harness deploy harnesses/engineering/pr-review/google.yaml --target claude

# 모든 하네스 배포
harness deploy-all --target openharness
```

---

## 하네스 라이브러리

### 엔지니어링 / 기능 개발

| 하네스 | 문화 | 설명 |
|---|---|---|
| `toss-feature-dev` | 🇰🇷 토스 | 저점을 높이기 — 컨텍스트 시딩 → 플랜 승인 → 구현 → PR |

### 엔지니어링 / PR 리뷰

| 하네스 | 문화 | 설명 |
|---|---|---|
| `google-pr-review` | Google | 멘토링 톤, Nit: 시스템, net positive 시 승인 |
| `uber-pr-review` | Uber | 멀티패스 (버그 → 컨벤션 → 보안), 신호 대 잡음비 |
| `shopify-pr-review` | Shopify | PR당 하나의 관심사, 200-300 LOC, 집단적 코드 소유권 |
| `stripe-pr-review` | Stripe | API 계약은 영구적, float-for-money는 blocking |

**출시 예정**: `kakao-scale-review` · `naver-search-review` · `mercari-trust-safety` · `smarthr-compliance` · `japan-appi-compliance`

---

## 회사 템플릿

회사 템플릿은 완전한 에이전트 조직을 번들로 제공합니다:
**Paperclip 조직 설정 + HarnessMart 하네스 + OpenHarness 설정**.

```bash
# 템플릿 살펴보기
ls templates/

# 템플릿 사용
# 1. OpenHarness에 하네스 배포
harness deploy-all --target openharness

# 2. Paperclip 인스턴스에 paperclip.json 임포트
# Paperclip UI → Companies → Import → templates/korean-startup/paperclip.json
```

### 사용 가능한 템플릿

| 템플릿 | 에이전트 수 | 설명 |
|---|---|---|
| `korean-startup` | 8 | 시리즈 A 한국 스타트업 — 토스 속도, PIPA 컴플라이언스 |

---

## CLI 레퍼런스

```bash
harness list                              # 모든 하네스 목록
harness validate <file>                   # 하네스 YAML 검증
harness build <file>                      # SKILL.md로 컴파일
harness build-all                         # 모든 하네스 컴파일
harness preview <file>                    # 드라이런 미리보기
harness deploy <file> --target <target>   # 런타임에 배포
harness deploy-all --target <target>      # 모두 배포

# 배포 타겟:
#   openharness   →  ~/.openharness/skills/   (기본값)
#   claude        →  ~/.claude/skills/
#   local         →  ./compiled/
```

---

## 하네스 작성하기

```yaml
name: my-harness
version: 1.0.0
description: 이 하네스가 하는 일

action_space:
  tools: [read_file, search_codebase, post_inline, approve]

review_criteria:
  required:
    - name: correctness
      description: 코드가 의도한 대로 동작하는가?
      weight: 3

comment_style:
  tone: mentoring   # mentoring | direct | collaborative | trust_based
  nit_prefix: "Nit:"
  require_explanation: true

severity:
  blocking_triggers: [correctness_bug, security_vulnerability]
  non_blocking_triggers: [style_preference]
  default: non_blocking

approval:
  strategy: net_positive  # net_positive | all_blocking_resolved | manual_only

hitl_gates:
  - trigger: security_vulnerability_found
    action: flag_for_security_review
    message: 머지 전에 보안 팀에 에스컬레이션하세요.
```

---

## 인테그레이션

- [OpenHarness 인테그레이션](integrations/openharness.md) — OpenHarness 런타임에 하네스 배포
- [Paperclip 인테그레이션](integrations/paperclip.md) — Paperclip 에이전트 회사에서 하네스 사용

---

## 기여하기

기여를 환영합니다 — 특히 한국과 일본 엔지니어링 문화를 인코딩한 하네스.

```bash
git clone https://github.com/your-org/harnesmart
cd harnesmart
npm install
npm run build

# 하네스 추가
vim harnesses/engineering/feature-dev/your-company.yaml

# 검증
harness validate harnesses/engineering/feature-dev/your-company.yaml

# PR 제출
```

하네스 품질 기준은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

---

## 감사의 말

이 프로젝트는 다음 분들의 어깨 위에 서 있습니다:

- **[OpenHarness](https://github.com/HKUDS/OpenHarness)** (★6.4k) — 우리 하네스를 실행하는 에이전트 런타임. HKUDS 팀 제작, MIT 라이선스.
- **[Paperclip](https://github.com/paperclipai/paperclip)** (★48.8k) — 에이전트를 회사로 조직하는 오케스트레이션 계층. MIT 라이선스.
- **[토스 테크 블로그](https://toss.tech/article/harness-for-team-productivity)** — 팀 LLM 생산성의 저점을 높이기 위한 하네스 활용에 관한 김용성님의 글. 이 프로젝트의 영감.
- **[OpenAI Harness Engineering](https://openai.com/index/harness-engineering/)** — 수동으로 작성된 코드 없이 프로덕션 소프트웨어를 구축하는 Ryan Lopopolo의 글. 이 프로젝트를 긴급하게 만든 시장 신호.
- **[Claude Code](https://claude.ai/code)** & **[Thariq의 트윗](https://x.com/trq212/status/2027463795355095314)** — 액션 스페이스 문제와 하네스가 컴파일되는 스킬/플러그인 형식을 정의한 것에 감사드립니다.

---

## 라이선스

MIT
