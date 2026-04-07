# HarnessMart

**English** · [한국어](README.ko.md)

> The harness library for agent-first engineering teams in Korea and Japan.
> Every agent. Every workflow. One command.

---

## What is a Harness?

An AI agent without a harness is a blank slate — capable, but directionless.
A **harness** defines the agent's action space, domain expertise, behavioral guardrails,
and governance rules. It encodes *how work gets done* in your organization.

```
Without harness:  Agent knows how to code. Doesn't know your team's standards.
With harness:     Agent codes, reviews, and ships exactly like your best engineer.
```

HarnessMart is the library of harnesses — encoded from the best engineering cultures
in Korea, Japan, and globally — deployable in one command.

---

## The Stack

HarnessMart sits at the definition layer of a four-layer agent infrastructure stack.
We use best-in-class open-source tools at every other layer.

```
┌─────────────────────────────────────────────────────────┐
│  HARNESMART  (this project)                             │
│  harness library · company templates · KR/JP community  │
├─────────────────────────────────────────────────────────┤
│  HaC CLI  (this project)                                │
│  harness define · build · validate · deploy             │
├─────────────────────────────────────────────────────────┤
│  OpenHarness  github.com/HKUDS/OpenHarness  ★6.4k       │
│  agent runtime · 43 tools · provider routing · memory   │
├─────────────────────────────────────────────────────────┤
│  Paperclip  github.com/paperclipai/paperclip  ★48.8k    │
│  org charts · goals · budgets · governance              │
├─────────────────────────────────────────────────────────┤
│  LLM                                                    │
│  Claude · GPT-5 · Codex · HyperCLOVA X · EXAONE        │
└─────────────────────────────────────────────────────────┘
```

We build the definition and library layer.
We do not compete with OpenHarness or Paperclip — we are deeply grateful to their teams
for building the runtime and orchestration infrastructure that makes this possible.

---

## Quick Start

```bash
# Install
npm install -g harness-cli

# List available harnesses
harness list

# Deploy Toss-style feature development harness to OpenHarness
harness deploy harnesses/engineering/feature-dev/toss.yaml --target openharness

# Deploy to Claude Code
harness deploy harnesses/engineering/pr-review/google.yaml --target claude

# Deploy all harnesses
harness deploy-all --target openharness
```

---

## Harness Library

### Product Management

| Harness | Culture | Description |
|---|---|---|
| `toss-pm` | 🇰🇷 Toss | 고객 중심 — customer problem → AC → success metric → unblock engineering |

### Engineering / Feature Development

| Harness | Culture | Description |
|---|---|---|
| `toss-feature-dev` | 🇰🇷 Toss | 저점을 높이기 — context seeding → plan approval → implement → PR |
| `aws-feature-dev` | Amazon / AWS | Working Backwards → 6-pager → implement → ORR → one-box → canary → global |

### Engineering / PR Review

| Harness | Culture | Description |
|---|---|---|
| `google-pr-review` | Google | Mentoring tone, Nit: system, approve on net positive |
| `uber-pr-review` | Uber | Multi-pass (bugs → conventions → security), signal-to-noise |
| `shopify-pr-review` | Shopify | One concern per PR, 200-300 LOC, collective ownership |
| `stripe-pr-review` | Stripe | API contracts are permanent, float-for-money is blocking |

### Engineering / Security

| Harness | Culture | Description |
|---|---|---|
| `korean-fintech-security` | 🇰🇷 Korean Fintech | PIPA compliance + AppSec — PII, RRN, float-for-money, payment security |

### Engineering / QA

| Harness | Culture | Description |
|---|---|---|
| `toss-qa` | 🇰🇷 Toss | AC coverage, regression tests, payment idempotency, given/when/then |

### Engineering / Ops

| Harness | Culture | Description |
|---|---|---|
| `toss-ops` | 🇰🇷 Toss | 빠른 감지·복구 — deployment safety, ORR, incident runbook, deployment windows |

**Coming soon**: `kakao-scale-review` · `naver-search-review` · `mercari-trust-safety` · `smarthr-compliance` · `japan-appi-compliance` · `toss-architect`

---

## Company Templates

Company templates bundle a complete agent organization:
**Paperclip org config + HarnessMart harnesses + OpenHarness setup**.

```bash
# Browse templates
ls templates/

# Use a template
# 1. Deploy harnesses to OpenHarness
harness deploy-all --target openharness

# 2. Import paperclip.json into your Paperclip instance
# Paperclip UI → Companies → Import → templates/korean-startup/paperclip.json
```

### Available Templates

| Template | Agents | Description |
|---|---|---|
| `korean-startup` | 8 | Series A 한국 스타트업 — Toss velocity, PIPA compliance |

---

## CLI Reference

```bash
harness list                              # list all harnesses
harness validate <file>                   # validate harness YAML
harness build <file>                      # compile to SKILL.md
harness build-all                         # compile all harnesses
harness preview <file>                    # dry-run preview
harness deploy <file> --target <target>   # deploy to runtime
harness deploy-all --target <target>      # deploy all

# Deploy targets:
#   openharness   →  ~/.openharness/skills/   (default)
#   claude        →  ~/.claude/skills/
#   local         →  ./compiled/
```

---

## Writing a Harness

```yaml
name: my-harness
version: 1.0.0
description: What this harness does

action_space:
  tools: [read_file, search_codebase, post_inline, approve]

review_criteria:
  required:
    - name: correctness
      description: Does the code do what it intends?
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
    message: Escalate to security team before merging.
```

---

## Integrations

- [OpenHarness Integration](integrations/openharness.md) — deploy harnesses to the OpenHarness runtime
- [Paperclip Integration](integrations/paperclip.md) — use harnesses in Paperclip agent companies

---

## Contributing

Contributions welcome — especially harnesses encoding Korean and Japanese engineering cultures.

```bash
git clone https://github.com/your-org/harnesmart
cd harnesmart
npm install
npm run build

# Add your harness
vim harnesses/engineering/feature-dev/your-company.yaml

# Validate
harness validate harnesses/engineering/feature-dev/your-company.yaml

# Submit PR
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for harness quality standards.

---

## Acknowledgements

This project stands on the shoulders of:

- **[OpenHarness](https://github.com/HKUDS/OpenHarness)** (★6.4k) — the agent runtime that executes our harnesses. Built by HKUDS, MIT license.
- **[Paperclip](https://github.com/paperclipai/paperclip)** (★48.8k) — the orchestration layer that organizes agents into companies. MIT license.
- **[Toss Tech Blog](https://toss.tech/article/harness-for-team-productivity)** — 김용성's article on using harnesses to raise the floor of team LLM productivity. The inspiration for this project.
- **[OpenAI Harness Engineering](https://openai.com/index/harness-engineering/)** — Ryan Lopopolo's article on building production software with zero manually-written code. The market signal that made this urgent.
- **[Claude Code](https://claude.ai/code)** & **[Thariq's tweet](https://x.com/trq212/status/2027463795355095314)** — for defining the action space problem and the skill/plugin format that harnesses compile to.

---

## License

MIT
