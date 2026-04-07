# Archon

**English** · [한국어](README.ko.md)

> Deploy your AI agent team in minutes.
> Pick a package. Connect your LLM. Ship.

---

## What is Archon?

Archon is a full-stack AI agent platform — definition layer, execution engine, and orchestration UI in one. You bring your own LLM API key. Archon brings the team.

```
Without Archon:  You prompt one agent. It knows how to code. It doesn't know your standards.
With Archon:     You deploy a team. Each agent knows its role, culture, and compliance requirements.
```

---

## The Stack

```
┌─────────────────────────────────────────────────────────┐
│  Archon UI                                              │
│  agent teams · org charts · budgets · governance        │
├─────────────────────────────────────────────────────────┤
│  Archon Engine                                          │
│  agent runtime · 43 tools · memory · agentic loops     │
├─────────────────────────────────────────────────────────┤
│  Archon Harness  (this repo)                            │
│  harness library · packages · CLI · KR/JP community     │
├─────────────────────────────────────────────────────────┤
│  Your LLM                                               │
│  Claude · GPT · HyperCLOVA X · EXAONE · any API        │
└─────────────────────────────────────────────────────────┘
```

---

## Zero to Market Packages

One command spins up a full 14-agent team — PM to customer service.

| Package | Culture | Compliance | Best for |
|---|---|---|---|
| `zero-to-market` | Toss + AWS + Google | — | Any product |
| `zero-to-market-kr` | Toss | PIPA · FSC · FSS | Korean market |
| `zero-to-market-jp` | Mercari | APPI · J-SOX · FSA | Japanese market |
| `zero-to-market-us` | AWS + Stripe | — | US / global |

**The 14-agent team:**

| Role | Default Harness |
|---|---|
| PM | toss-pm |
| Architect | aws-architect |
| Frontend Dev | toss-frontend-dev |
| Backend Dev | toss-feature-dev |
| Security | korean-fintech-security |
| QA | toss-qa |
| DevOps | toss-ops |
| PR Reviewer | google-pr-review |
| Data Engineer | aws-data-engineer |
| Technical Writer | aws-technical-writer |
| GTM Strategist | toss-gtm-strategist |
| Marketer | toss-marketer |
| Sales | toss-sales |
| Customer Service | toss-customer-service |

---

## Harness Library

20 harnesses across engineering, security, and business roles.

### Engineering

| Harness | Culture | Mode | Description |
|---|---|---|---|
| `toss-feature-dev` | Toss | team | 저점을 높이기 — every engineer ships like your best |
| `aws-feature-dev` | AWS | team | Working Backwards → 6-pager → ORR → gradual deploy |
| `mercari-feature-dev` | Mercari | team | Go Bold, blameless culture, feature flags, small PRs |
| `toss-frontend-dev` | Toss | team | Performance, PIPA-compliant forms, Core Web Vitals |
| `aws-architect` | AWS | team | Well-Architected, ADRs, Type 1/2 decisions |
| `aws-data-engineer` | AWS | team | Schema safety, idempotent pipelines, data contracts |
| `aws-technical-writer` | AWS | solo | PR/FAQ, API docs, runbooks |
| `toss-ops` | Toss | team | Deployment rings, DB migration safety, fast recovery |
| `toss-qa` | Toss | team | AC coverage, payment idempotency, boundary values |

### PR Review

| Harness | Culture | Mode |
|---|---|---|
| `google-pr-review` | Google | solo |
| `shopify-pr-review` | Shopify | solo |
| `stripe-pr-review` | Stripe | solo |
| `uber-pr-review` | Uber | solo |

### Security & Compliance

| Harness | Regulations | Mode |
|---|---|---|
| `korean-fintech-security` | PIPA · FSC · FSS · RRN | team |
| `japanese-enterprise-security` | APPI · My Number · J-SOX · FSA | team |

### Business

| Harness | Culture | Mode | Description |
|---|---|---|---|
| `toss-pm` | Toss | team | Customer problem → AC → success metric |
| `toss-gtm-strategist` | Toss | team | North Star metric, beachhead segment, launch plan |
| `toss-marketer` | Toss | team | Truth-based content, channel-market fit |
| `toss-sales` | Toss | team | Value-proof proposals, stakeholder mapping |
| `toss-customer-service` | Toss | team | Complete resolution, root cause escalation |

---

## CLI

```bash
npm install -g @archon/cli

# List all harnesses with mode
archon list

# Validate a harness
archon validate harnesses/engineering/feature-dev/toss.yaml

# Check deployment mode
archon mode harnesses/engineering/security/korean-fintech.yaml

# Build a harness
archon build harnesses/engineering/feature-dev/toss.yaml

# Deploy all (auto-routes by mode)
archon deploy-all
```

---

## Deployment Modes

| Mode | Runtime | Deploy target |
|---|---|---|
| `solo` | Your LLM directly | `~/.claude/skills/` |
| `team` | Archon Engine | `~/.archon/skills/` |
| `company` | Archon UI + Engine | Archon dashboard |

Modes are inferred automatically from harness structure. Override with `targets.mode`.

---

## Writing a Harness

Harnesses follow the **OAKP model**: Observation · Action · Knowledge · Permission.

```yaml
name: my-harness
version: 1.0.0
description: What this agent does

observation_space:        # What the agent can SEE (no side effects)
  - read_file
  - search_codebase

action_space:             # What the agent can DO (has side effects)
  - write_file
  - create_pr

review_criteria:          # What the agent KNOWS (domain expertise)
  required:
    - name: my_criterion
      description: What to check
      weight: 2

hitl_gates:               # When to pause for human approval (PERMISSION)
  - trigger: risky_action
    action: require_human_approval
    message: Please review before proceeding.

severity:
  blocking_triggers: [critical_issue]
  default: non_blocking

approval:
  strategy: all_blocking_resolved
  principle: Approve when all blocking issues resolved.

comment_style:
  tone: direct
  require_explanation: true
```

---

## Tiers

| | Solo | Team | Company |
|---|---|---|---|
| **For** | Individual devs | Engineering teams | Organizations |
| **Harness library** | ✓ | ✓ | ✓ |
| **Multi-agent handoffs** | — | ✓ | ✓ |
| **Agentic loops** | — | ✓ | ✓ |
| **HITL approval gates** | — | ✓ | ✓ |
| **Org chart of agents** | — | — | ✓ |
| **Budget controls** | — | — | ✓ |
| **Audit trails** | — | — | ✓ |

---

## Early Access

→ [usik.github.io/archon](https://usik.github.io/archon)
