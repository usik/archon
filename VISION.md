# HarnessMart — Vision & Execution Plan
## The KR/JP Agent Infrastructure Company

**Date**: 2026-04-07
**Status**: Pre-product, pre-launch

---

## 1. The Big Picture

### What We're Building

We are building the **infrastructure layer for agent-first companies in Korea and Japan** — the missing piece between raw AI models and functioning multi-agent organizations.

The world is moving toward a future where many AI agents work in parallel on behalf of a single human or team. These agents communicate with each other, delegate tasks, and make decisions autonomously. To function safely and correctly, every agent needs:

1. A defined **action space** — what it can and cannot do
2. Encoded **domain knowledge** — how things are done in this company, team, or culture
3. Clear **governance rules** — when to act autonomously, when to ask a human
4. A standard **interface** — so other agents know what to expect from it

Today, none of this is standardized. Every team rebuilds it from scratch. Every agent is a blank slate.

We encode this into **harnesses** — structured, versioned, deployable definitions that turn a generic AI agent into a specialist with a job description, expertise, and behavioral guardrails.

### The One-Line Vision

> **"The operating manual for every agent in Korea and Japan — downloadable in one command."**

---

## 2. Why Now

Four market signals converged in early 2026:

| Signal | What It Means |
|---|---|
| OpenAI "Harness Engineering" article (Feb 11, 2026) — 3 engineers, 1M lines, 0 manual code | The concept is proven at production scale |
| Thariq's tweet (Claude Code engineer, 11K likes) — "hardest part is designing the action space" | The problem is widely felt, unsolved |
| Toss Tech blog — "팀의 저점을 높이는 하네스" | Korean enterprises are thinking about this right now |
| OpenHarness (6.4K stars in 5 days), Paperclip (48.8K stars) | The runtime and orchestration layers are being built by the community — the definition layer is still empty |

The runtime problem (OpenHarness) and the orchestration problem (Paperclip) are being solved. Nobody is solving the **library and marketplace problem** for Korea and Japan.

---

## 3. The Technology Stack

We sit at Layer 3 in a 4-layer stack. We do not compete with any other layer. We orchestrate them.

```
┌──────────────────────────────────────────────────────────────────┐
│  LAYER 4 — HARNESMART MARKETPLACE  (we build this)               │
│                                                                  │
│  KR/JP harness library  ·  company templates  ·  community       │
│  Korean + Japanese UI   ·  local compliance   ·  Clipmart KR/JP  │
└──────────────────────────┬───────────────────────────────────────┘
                           │  harness definitions
┌──────────────────────────▼───────────────────────────────────────┐
│  LAYER 3 — HAC CLI  (already built ✓)                            │
│                                                                  │
│  harness define · build · validate · deploy · audit              │
│  YAML schema → compiled SKILL.md / AGENTS.md                     │
└──────────────────────────┬───────────────────────────────────────┘
                           │  compiled skills
┌──────────────────────────▼───────────────────────────────────────┐
│  LAYER 2 — OPENHARNESS  (use, don't build)                       │
│                                                                  │
│  tool runtime · provider routing · memory · permissions          │
│  supports: Claude, GPT-5, Codex, HyperCLOVA X, EXAONE, Kimi     │
└──────────────────────────┬───────────────────────────────────────┘
                           │  agent employees
┌──────────────────────────▼───────────────────────────────────────┐
│  LAYER 1 — PAPERCLIP  (use, don't build)                         │
│                                                                  │
│  org charts · goals · budgets · heartbeats · governance          │
│  the "company" container for all agents                          │
└──────────────────────────────────────────────────────────────────┘
```

### What Each Layer Does

| Layer | Player | Answers |
|---|---|---|
| 4 — Marketplace | **Us** | Where do I find harnesses? Which ones fit my culture? |
| 3 — Definition | **HaC CLI** | What is this agent's action space, expertise, and policy? |
| 2 — Runtime | OpenHarness | How does the agent execute tools, manage context, route to LLMs? |
| 1 — Orchestration | Paperclip | Who are the agents, how are they organized, what are their goals? |

### Why We Don't Build Layers 1–2

- OpenHarness: 6.4K stars, MIT license, Python, 43 tools, already supports Korean models
- Paperclip: 48.8K stars, MIT license, Node.js, full org/governance infrastructure
- Rebuilding these would take 6–12 months. Using them takes a day.
- Our moat is not the runtime. It is the **library of culturally-specific harnesses** and the **KR/JP community** — neither of which OpenHarness or Paperclip will build.

---

## 4. The Product

### 4.1 HaC CLI (Already Built)

The command-line tool for defining and compiling harnesses. Already works.

```bash
harness list                          # browse available harnesses
harness validate google-pr-review     # validate YAML schema
harness build uber-pr-review          # compile to SKILL.md
harness build-all                     # compile entire library
harness deploy --target openharness   # deploy to runtime
```

Current harnesses: `google-pr-review`, `uber-pr-review`, `shopify-pr-review`, `stripe-pr-review`

### 4.2 HarnessMart — The Marketplace

The web platform. Think npm registry meets Clipmart, built for KR/JP.

**Three core features:**

**① Harness Library**
Browse, search, and install individual harnesses for specific agent roles.

```
/harnesses
  /engineering
    google-pr-review       ★ 2.1k   Google engineering practices
    toss-feature-dev       ★ 891    Toss-style rapid feature development
    kakao-scale-review     ★ 634    Kakao architecture review standards
    mercari-trust-safety   ★ 441    Mercari trust & safety audit
    smarthr-compliance     ★ 389    SmartHR compliance-first development

  /incident-response
    toss-incident          ★ 712    Toss SRE runbook
    naver-search-incident  ★ 298    Naver search reliability patterns

  /security
    korean-fintech-appsec  ★ 523    FSC-compliant security audit
    japan-appi-compliance  ★ 441    APPI data handling standards
```

**② Company Templates** (the Clipmart KR/JP equivalent)
Full agent company configurations — one download gives you everything.

Each template bundles:
- Paperclip org chart (roles, reporting, budgets)
- HaC harnesses for each agent role
- OpenHarness configuration
- Pre-wired to local tools (Kakao Work, LINE Works, Slack KR, Backlog JP)

*Template examples:*
- **"Korean Startup (Series A)"** — 8 agents, fast iteration, Notion + Linear, Korean compliance
- **"Japanese Enterprise SaaS"** — 15 agents, audit trails, APPI compliance, nemawashi gates
- **"K-Commerce Operations"** — agents for product, CS, logistics, fraud, analytics
- **"KR/JP Fintech"** — agents with FSC + FSA compliance baked in

**③ Community**
- Harness submissions with peer review and scoring
- Based on junheedot's 12-principle framework (harness quality score 0–100)
- Integration with Zenn, Qiita, Velog, okky.kr for content distribution
- Monthly "best harness" showcase
- Company-specific harness contributions (like how Airbnb open-sourced ESLint rules)

### 4.3 Korean/Japanese-Specific Harnesses

The core library that makes the marketplace worth visiting.

**Korea — Engineering Culture Library:**

| Harness | Culture Encoded |
|---|---|
| `toss-feature-dev` | Rapid iteration, "저점 높이기", Jira + branch automation |
| `kakao-scale-review` | Massive scale, super-app architecture, traffic spike patterns |
| `naver-search-review` | Data-driven, search-first, A/B test gates |
| `krafton-game-review` | Game dev patterns, performance-critical, live service ops |
| `korean-startup-velocity` | Fast execution, minimal process, pivot-ready architecture |
| `korean-fintech-compliance` | FSC regulations, real-time settlement, PII handling |

**Japan — Engineering Culture Library:**

| Harness | Culture Encoded |
|---|---|
| `mercari-trust-safety` | Marketplace trust, fraud detection, user safety gates |
| `smarthr-compliance` | HR compliance, audit trails, APPI data handling |
| `cybozu-quality` | Monozukuri quality standards, kaizen improvement loops |
| `japan-enterprise-nemawashi` | Consensus gates, broad HITL, documentation-first |
| `japan-appi-compliance` | APPI privacy law, data residency, consent management |
| `line-crossborder` | LINE Works integration, KR/JP bilingual workflows |

---

## 5. The Multi-Agent Future — Where Harnesses Fit

Beyond engineering tools, harnesses become the organizational DNA for any agent-first company. This is the 3-year vision.

### Every Agent Needs a Harness

In a multi-agent company, each agent has a role. The harness defines that role:

```
Human (CEO/Founder)
    │
    ▼ defines goals
PM Agent [product-manager harness]
    │ writes specs + tickets
    ▼
Architect Agent [system-design harness]
    │ designs solution
    ▼
Coder Agents ×N [coding harness — google-style OR toss-style]
    │ implement
    ▼
Reviewer Agent [pr-review harness — company culture encoded]
    │ reviews
    ▼
Security Agent [security-audit harness — FSC/APPI compliant]
    │ clears
    ▼
Deploy Agent [deploy-governance harness]
    │ deploys
    ▼
Monitor Agent [observability harness]
```

Every arrow in this diagram is a harness handoff. The harness defines:
- What output format Agent A produces (so Agent B can consume it)
- What preconditions must be met before Agent B starts
- When Agent B escalates to a human vs. proceeds autonomously
- What company-wide policies apply regardless of what Agent A requests

### Harness as the Three Core Roles in Multi-Agent Systems

**1. Agent Identity Card**
When Agent A considers delegating to Agent B, it reads B's harness to understand: what can I ask this agent? What format does it produce? When will it pause for human approval?

**2. Inter-Agent Interface Contract**
The harness is a type system for agent collaboration. Input schema, output schema, preconditions, postconditions — catching mismatches before they become production failures.

**3. Governance Without a Human in the Room**
When 10 agents work in parallel, no human watches every step. The harness IS the policy enforcement layer — encoding organizational rules that apply automatically, even when no human is present.

### The Long-Term Scope

Engineering workflows are the beachhead. The endgame is every team:

| Team | Harness Types |
|---|---|
| Engineering | PR review, feature dev, migration, security audit, deploy |
| Product | Research synthesis, spec writing, prioritization frameworks |
| Legal/Compliance | Contract review, APPI/PIPA compliance checks, risk assessment |
| Finance | Report generation, anomaly detection, audit preparation |
| Sales | Prospect research, proposal generation, follow-up sequences |
| Customer Success | Ticket triage, escalation routing, resolution patterns |

Each of these domains has culture-specific variants. The KR/JP marketplace captures all of them.

---

## 6. Business Model

### Pricing Tiers

**Free — Community**
- Full HaC CLI (always free)
- Community harness library — all publicly contributed harnesses
- Basic marketplace browsing and installation
- Open source, MIT license

**Team — ₩49,000/mo or ¥4,900/mo**
- Private harness registry (publish internal harnesses, not shared publicly)
- Team analytics dashboard (which harnesses deployed, usage patterns, drift detection)
- Visual harness diff viewer (compare versions before deploying updates)
- Slack/LINE notification on harness updates

**Enterprise — Custom**
- Compliance harness packages (PIPA, APPI, FSC, FSA pre-built)
- SSO + RBAC for harness access control
- Audit logs (who deployed what harness when — full audit trail)
- Governance enforcement (mandate specific harnesses org-wide)
- Custom harness build service (we encode your company's culture)
- On-premise deployment option
- SLA + Korean/Japanese language support

**Marketplace Revenue Share**
- 15% of paid template transactions
- Featured listing program for premium harness publishers
- Verified publisher badge (quality certification)

### Revenue Projections (Conservative)

| Month | Teams (Free) | Teams (Paid) | MRR |
|---|---|---|---|
| 3 | 200 | 10 | ₩490K |
| 6 | 800 | 50 | ₩2.45M |
| 12 | 3,000 | 200 | ₩9.8M |
| 18 | 8,000 | 600 + 5 enterprise | ₩29.4M + enterprise |

---

## 7. Go-to-Market

### Phase 0 — Foundation (Month 1–2)

**Goal**: Build the KR/JP harness library before launching the marketplace. An empty store has no visitors.

| Action | Detail |
|---|---|
| Build 10 Korean harnesses | Toss, Kakao, Naver, Korean fintech, Korean startup cultures |
| Build 8 Japanese harnesses | Mercari, SmartHR, Cybozu, APPI compliance, nemawashi |
| Test with 3 Korean teams | Validate harnesses work in real workflows |
| Test with 2 Japanese teams | Validate cultural encoding is accurate |
| Build marketplace MVP | Simple web directory + install instructions |

**Key contacts to reach this month:**
- junheedot (harness-diagnostics author) — already building in this space, potential contributor
- 김용성 (Toss Tech blog author) — direct validation of the concept
- LINE Engineering Japan — KR/JP bridge, potential design partner

### Phase 1 — Korean Launch (Month 2–3)

**Goal**: Korean developer community traction. 500 stars, 50 active teams.

| Channel | Action |
|---|---|
| Velog | "한국 개발팀을 위한 Harness 라이브러리 — Toss/Kakao/Naver 스타일 in 1 command" |
| okky.kr | Community post, invite contributions |
| Toss Tech Blog | Guest post or collaboration with original author |
| Korean AI developer Slack | Share, gather feedback |
| GitHub | Korean README, Korean contribution guide |

**Launch narrative**: "We read the Toss blog, the OpenAI article, and Thariq's tweet. We built the library that makes harness engineering accessible to every Korean team — with Korean engineering culture encoded from day one."

### Phase 2 — Japanese Launch (Month 3–5)

**Goal**: Japanese developer community entry. Zenn/Qiita presence, 3 enterprise design partners.

| Channel | Action |
|---|---|
| Zenn.dev | Deep technical article (Japanese) on harness engineering + case study |
| Qiita | Article on "エージェントハーネスとは" — educational, Japanese developer focused |
| connpass.com | Virtual event on agent-first development |
| LINE Engineering | Partnership exploration — bridge KR/JP |
| SmartHR / Mercari / Cybozu | Direct outreach as design partners |

**Japanese launch narrative**: "AI エージェントが協働する時代、日本のエンジニアリング文化をハーネスとしてエンコードする最初のプラットフォーム"

### Phase 3 — Company Templates / Clipmart KR/JP (Month 5–7)

**Goal**: First full company templates on the marketplace. Enterprise pipeline opens.

- Launch 3 company templates (Korean Startup, Japanese Enterprise, KR/JP Fintech)
- Each template = Paperclip org chart + HaC harnesses + OpenHarness config
- One-command install: `harness template install korean-startup`
- Enterprise outreach begins — compliance-heavy sectors (fintech, HR tech)

### Phase 4 — Enterprise & Monetization (Month 7–9)

**Goal**: First 3 paying enterprise customers. Private registry live.

- Close 1 Korean fintech enterprise (FSC compliance harness package)
- Close 1 Japanese HR tech enterprise (APPI compliance harness package)
- Launch Team pricing tier
- Community harness count: 50+ (organic contributions)

---

## 8. Competitive Moat

### Why This is Hard to Copy

| Moat | Why It's Durable |
|---|---|
| **Cultural encoding** | Understanding Toss's "저점 높이기" or Japan's *nemawashi* deeply enough to encode it correctly takes insiders, not translators |
| **Community** | A Korean/Japanese developer community that contributes harnesses is self-reinforcing. The more harnesses, the more users; the more users, the more contributions |
| **First-mover in region** | Paperclip and Clipmart are US-focused. OpenHarness is Chinese-origin. Nobody is building for KR/JP with genuine cultural depth |
| **Compliance expertise** | PIPA (Korea), APPI (Japan), FSC, FSA — compliance harnesses require regulatory knowledge that generalist platforms won't invest in |
| **Enterprise relationships** | The first company to deploy harnesses at a Korean bank or Japanese enterprise becomes embedded infrastructure |

### What Could Threaten This

| Risk | Mitigation |
|---|---|
| Paperclip expands to KR/JP | Go deep on library and community before they do. They'll localize UI; they won't encode Korean culture |
| Anthropic/OpenAI builds native harness marketplace | We become the KR/JP community hub. Platform-agnostic harnesses work on any runtime |
| OpenHarness builds competing library | Partner early, contribute upstream. Being a core contributor = influence over direction |
| Korean/Japanese competitor emerges | The moat is the library depth + community trust, not the technology |

---

## 9. Partnerships

### Strategic Partners to Pursue

| Partner | What We Get | What We Offer |
|---|---|---|
| **OpenHarness (HKUDS)** | Distribution to 6.4K users, integration into their skills ecosystem | KR/JP community, high-quality harnesses to feature |
| **Paperclip** | Featured in Clipmart as KR/JP partner, distribution to 48.8K users | KR/JP company templates for their marketplace |
| **LINE / LINE Works** | Bridge to both Korean and Japanese markets, potential enterprise deployment | LINE-specific workflow harnesses, enterprise case study |
| **Toss / Viva Republica** | Credibility as the company that inspired the vision, potential design partner | Free enterprise tier, co-authoring harnesses |
| **Zenn.dev / Qiita** | Distribution to Japanese developer audience | Exclusive content, featured articles |

### Partnership Sequence

1. **OpenHarness first** — contribute harnesses to their skills directory, get featured. Easiest, fastest, highest ROI.
2. **Paperclip second** — reach out about KR/JP Clipmart integration. Position as regional partner, not competitor.
3. **LINE third** — enterprise bridge. Target LINE Engineering blog collaboration.
4. **Toss/Kakao** — design partner. Validate Korean harnesses with the teams they're modeled after.

---

## 10. The 90-Day Execution Plan

```
WEEK 1–2    HARNESS LIBRARY
            Build 10 Korean + 8 Japanese harnesses
            Key: toss-feature-dev, kakao-scale-review,
                 mercari-trust-safety, japan-appi-compliance

WEEK 3–4    CLI UPGRADE
            Add: harness deploy --target openharness
            Add: harness audit (12-principle checker)
            Add: harness template (company templates)
            Cross-compile: AGENTS.md + SKILL.md output

WEEK 5–6    MARKETPLACE MVP
            Simple web directory (Next.js)
            Browse / search / install harnesses
            Korean + Japanese UI
            GitHub-backed (harnesses as open source)

WEEK 7–8    KOREAN LAUNCH
            Velog + okky.kr + Korean AI Slack
            Reach out: junheedot, 김용성 (Toss)
            Target: 500 stars, 50 active teams

WEEK 9–10   OPENHARNESS + PAPERCLIP OUTREACH
            Submit PR: harnesses → OpenHarness skills/
            Reach out: Paperclip team → KR/JP Clipmart partner

WEEK 11–12  JAPANESE LAUNCH
            Zenn.dev + Qiita articles (Japanese)
            connpass virtual event
            3 enterprise design partners

MONTH 4–6   COMPANY TEMPLATES + ENTERPRISE
            First 3 company templates live
            Enterprise outreach: KR fintech, JP HR tech
            Team pricing tier launch
```

---

## 11. What Success Looks Like

### 6 Months
- 3,000 developers have installed at least one harness
- 50 community-contributed harnesses on the marketplace
- 3 enterprise design partners (1 KR fintech, 1 JP HR tech, 1 other)
- Featured in OpenHarness skills directory and Paperclip Clipmart
- First ₩5M MRR

### 12 Months
- The de facto harness library for Korean and Japanese engineering teams
- 100+ harnesses across engineering, product, compliance, operations
- 10+ company templates on the marketplace
- 3 paying enterprise customers
- Partnership with LINE, Toss, or major Korean/Japanese tech company

### 3 Years
- Every agent-first company in Korea and Japan runs on harnesses from HarnessMart
- Expanded beyond engineering: legal, finance, sales, CS harness templates
- The organizational DNA of Korean and Japanese business culture, encoded and downloadable
- Regional expansion: Southeast Asia (Vietnam, Indonesia, Singapore) using the same playbook

---

## 12. Open Questions

1. **Name**: "HarnessMart"? Something Korean-native? Something that works in both languages?
2. **Korean vs. Japanese first?** Korea has stronger initial signal (Toss blog, junheedot). Japan has larger enterprise market. Korea first, then Japan — confirmed by GTM plan above.
3. **Open source or proprietary marketplace?** Recommendation: harness library is fully open source (GitHub), marketplace web app is proprietary. Same model as npm vs. npmjs.com.
4. **Solo or co-founder?** The KR/JP cultural depth argument is strongest with a native co-founder in each market. Consider: junheedot as Korea collaborator, Japanese developer community leader as Japan collaborator.
5. **Funding?** The beachhead (free CLI + community library) can be built with zero funding. Enterprise tier and marketplace infrastructure may need seed funding at Month 6+.

---

*Last updated: 2026-04-07*
*Built on the shoulders of: OpenAI Harness Engineering, Toss Tech Blog, Thariq's Claude Code insights, OpenHarness (HKUDS), Paperclip*
