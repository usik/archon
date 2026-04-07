# GTM Strategy: Harness-as-Code (HaC) Platform

**Date**: 2026-04-06
**Product**: Harness-as-Code CLI + PR Review Harness Library
**Stage**: Pre-launch → Open Source Launch → Enterprise

---

## 1. Product Summary

**What it is**: A CLI tool that lets engineering teams define their AI agent's action space in YAML, and compile it into a deployable Claude Code skill (harness). First use case: PR review harnesses modeled after Google, Uber, Shopify, and Stripe engineering cultures.

**Core value loop**:
```
Define action space (YAML) → harness build → Claude Code skill → team deploys → PR reviewed by AI in your company's style
```

**Proof of concept already built**:
- `harness list / validate / build / build-all / preview` CLI
- 4 harness definitions encoding distinct review philosophies
- Zod-validated schema, TypeScript compiler, SKILL.md output

---

## 2. Market Signal

The "harness engineering" trend is emerging fast:

| Signal | Data |
|---|---|
| Thariq's tweet (Claude Code engineer) | 11K likes, 1.6K reposts, 3.9M views — Feb 2026 |
| Toss Tech blog (Korean fintech) | Detailed article on building team harnesses for LLM productivity |
| Claude Code marketplace launch | Anthropic explicitly building distribution for this category |
| Google eng-practices, Uber uReview | Well-documented review cultures with no AI encoding tooling |

**Window**: This market is forming right now. Harness-as-code has no established player. First-mover advantage is available.

---

## 3. Target Segments (Prioritized)

### Segment 1 — Beachhead: AI-Forward Engineering Teams (50–500 eng)

**Profile**: Mid-to-large tech companies actively using Claude Code. Have 1–3 "LLM power users" who manually write CLAUDE.md files today. Engineering managers frustrated that LLM quality varies wildly across the team.

**Pain**:
> "We're all using Claude Code but getting completely different results. Senior engineers produce merge-ready code in 10 minutes. Juniors fight with hallucinations for an hour."

**Why they buy**: They've felt the pain. They'll try a free CLI that gives them `harness build google-pr-review` in 30 seconds.

**Geography**: US tech hubs + Korea (Toss/Kakao/Line ecosystem showing early adoption), expanding to SEA/JP.

---

### Segment 2 — Platform Engineers / DevEx Teams

**Profile**: Teams building internal developer tooling. Own the company's CLAUDE.md, settings.json, and developer portal. Already thinking about standardizing LLM usage.

**Pain**:
> "I maintain our shared CLAUDE.md but it's getting out of hand. There's no way to version it, test it, or distribute it to new repos."

**Why they buy**: HaC gives them infrastructure-grade tooling for what they're already doing by hand.

---

### Segment 3 — Expansion: Enterprise (1000+ eng)

**Profile**: Large orgs needing governance, audit trails, and compliance enforcement for AI usage. CISO/CTO asking "what is our AI doing?"

**Pain**:
> "We need to prove to our compliance team that our AI agents follow our security policies."

**Why they buy**: Governance layer — AI policy-as-code. Private registry for internal harness distribution.

---

## 4. Positioning & Messaging

### Core Positioning

> **"The npm of AI agent workflows."**
> Define your team's coding standards once. Your AI follows them everywhere.

### Value Proposition by Audience

| Audience | Message | Proof Point |
|---|---|---|
| Engineering Manager | "Raise your whole team's AI output to your best engineer's standard." | Toss Tech: "저점을 높이는(Raising the Floor)" — the concept they use themselves |
| Platform Engineer | "Version, test, and distribute your team's LLM workflows like code." | `harness validate` catches schema errors before they break prod |
| Individual Eng | "Stop fighting with AI that doesn't know your team's style. Install one command." | `harness build google-pr-review` → deploy → done |
| CTO / CISO | "Encode your AI governance policy. Every agent follows it automatically." | HITL gates, approval policies, audit-ready harness diffs |

### Differentiation from Generic Prompting

| Them (manual CLAUDE.md) | Us (HaC) |
|---|---|
| Written by one person | Schema-validated, peer-reviewed |
| No versioning | Semantic versioning, diffs between versions |
| Lives in one repo | Published to registry, reusable |
| No testing | `harness validate`, `harness preview` |
| One team's opinion | Community library: Google-style, Stripe-style, etc. |

### Key Taglines (test these)

1. *"Your team's coding standards. Your AI's behavior."*
2. *"Install Google's PR review culture in one command."*
3. *"The missing infrastructure for AI coding agents."*

---

## 5. Go-to-Market Channels

### Channel 1 — Open Source / GitHub (Primary, Launch)

**Why**: Developer tools live and die on GitHub stars + npm installs. The harness library itself is the marketing. Every company that ships a harness is a case study.

**Tactics**:
- Launch `harness-cli` on GitHub with the 4 harnesses on day 1
- Publish `@harness/google-pr-review`, `@harness/uber-pr-review` on npm
- File structure and schema designed to be "fork-friendly"
- CONTRIBUTING.md invites the community to add new harnesses

**Target**: 500 stars in 30 days, 10 community harnesses in 90 days

---

### Channel 2 — Developer Social (X / Twitter, HN)

**Why**: The market signal already exists on X (Thariq's tweet, Toss blog). The conversation is happening. Join it with a demo.

**Tactics**:
- Launch tweet thread: "We analyzed how Google, Uber, Shopify, and Stripe do code review. Then we encoded it. Install any of them in one command. 🧵"
- Post demo GIF: `harness list` → `harness build uber-pr-review` → Claude Code PR review running
- Reply to Thariq's thread with a reference implementation of HaC
- HN Show HN: "Show HN: Harness-as-Code — encode your team's AI action space in YAML"
- Korean developer communities: dev.naver.com, okky.kr (given Toss signal)

**Target**: 1 HN front page appearance, 2K+ X impressions on launch day

---

### Channel 3 — Content Marketing (SEO + Thought Leadership)

**Why**: "How to do PR review with AI" is a question millions of engineers will ask in 2026. Owning that content = organic top-of-funnel.

**Tactics**:

Blog series: *"The Harness Engineering Series"*

1. **"How Google Does PR Review (and How to Make Your AI Do the Same)"** — most Google-style shops → high search intent
2. **"What is an AI Action Space? And Why Your Team Should Define One"** — educational, positions HaC as the category
3. **"We Analyzed 10 Engineering Cultures. Here's What Makes a Great Code Reviewer."** — shareable, comprehensive
4. **"From CLAUDE.md to Harness: How Toss Bank Raised Their AI Floor"** — case study format

**Distribution**: dev.to, Medium/engineering blog, LinkedIn (for EM/CTO audience), HN links

**Target**: 3 posts ranking for "AI code review," "Claude Code harness," "engineering AI workflow" in 90 days

---

### Channel 4 — Claude Code Marketplace

**Why**: Anthropic is building distribution. First movers in the marketplace get the network effect.

**Tactics**:
- Publish all 4 harnesses to the Claude Code plugin marketplace
- Each harness is discoverable by name: `google-pr-review`, `stripe-pr-review`
- Marketplace listing = free distribution to every Claude Code user
- Partner with Anthropic to be a featured publisher (reach out to Claude Code team directly — reference Thariq's tweet context)

**Target**: Listed in top 10 "dev tools" category in marketplace within 60 days

---

### Channel 5 — Direct Outreach (Enterprise Pipeline)

**Why**: Enterprise revenue is the monetization path. First 5 enterprise customers validate the governance angle.

**Tactics**:
- Target engineering managers at companies already using Claude Code (signal: job listings mentioning "Claude Code," "AI coding agents")
- Outreach sequence: share the blog post → offer a "custom harness" build session → convert to paid
- LinkedIn DM to DevEx leads, platform engineering managers
- Partner with AI consulting firms already deploying Claude Code (reseller channel)

**Target**: 5 qualified enterprise conversations in first 60 days

---

### Channel 6 — Community (Slack/Discord)

**Why**: Developer communities are where adoption spreads laterally (engineer tells engineer).

**Tactics**:
- Claude Code community Discord/Slack: share harnesses as examples, not spam
- AI engineering communities: MLOps Community, AI Engineer Discord
- Korean developer community: Toss has a public Slack; connect with the author of the harness blog post directly
- Create a `#harness-engineering` channel or thread in the major AI coding Slacks

---

## 6. Launch Plan

### Phase 0 — Pre-Launch (Now → Day 14)

**Goal**: Validate with 3 friendly teams before going public.

| Action | Owner | Deadline |
|---|---|---|
| Install harness CLI with 1 friendly engineering team | You | Day 3 |
| Run first real PR review with `uber-pr-review` harness | You | Day 5 |
| Gather feedback: what was wrong, missing, or surprising | You | Day 7 |
| Iterate schema + compiler based on feedback | You | Day 10 |
| Confirm 2 more teams willing to be early users | You | Day 14 |

**Go/No-Go signal**: At least 1 team says "we would use this regularly."

---

### Phase 1 — Open Source Launch (Day 15–30)

**Goal**: GitHub presence, first 500 stars, validation that the community resonates.

| Action | Channel | Day |
|---|---|---|
| Publish `harness-cli` GitHub repo (4 harnesses + full CLI) | GitHub | Day 15 |
| Publish npm packages: `harness-cli`, `@harness/google-pr-review`, etc. | npm | Day 15 |
| Launch tweet thread with demo GIF | X | Day 15 |
| Post "Show HN: Harness-as-Code" | Hacker News | Day 16 |
| Cross-post to dev.to, publish first blog post | Content | Day 17 |
| Post in Claude Code Discord/Slack | Community | Day 18 |
| DM Thariq (@trq212) with reference to his tweet + what you built | X DM | Day 15 |
| Korean developer community post (referencing Toss blog) | okky/naver | Day 20 |

**Go/No-Go signal**: 200+ stars in first week → proceed to Phase 2.

---

### Phase 2 — Community Harness Library (Day 30–60)

**Goal**: 10+ community harnesses, marketplace listing, first enterprise conversations.

| Action | Channel | Day |
|---|---|---|
| Add 3 more harness styles (Netflix, Microsoft, Airbnb) | GitHub | Day 30 |
| Open contribution program: "Add your company's style" | GitHub | Day 30 |
| Publish 2 more blog posts (series #2, #3) | Content | Day 35, Day 45 |
| Claude Code marketplace submission | Marketplace | Day 35 |
| Start enterprise outreach (5 targets) | Direct | Day 40 |
| Add `harness mix` command (blend two styles) | Product | Day 50 |

---

### Phase 3 — Enterprise + Monetization (Day 60–90)

**Goal**: First paying enterprise customer. Private registry MVP.

| Action | Channel | Day |
|---|---|---|
| Close first enterprise pilot (even unpaid is fine) | Direct | Day 70 |
| Launch "Harness Hub" — private registry for teams | Product | Day 75 |
| Publish case study: "[Company] PR Review Quality After Harness" | Content | Day 80 |
| Partner with 1 AI consulting firm | Partnerships | Day 85 |
| Second enterprise customer pilot | Direct | Day 90 |

---

## 7. Pricing Model

### Free (Open Source)
- `harness-cli` CLI — always free
- Community harness library (Google, Uber, Shopify, Stripe, etc.) — always free
- `harness validate`, `harness build`, `harness preview` — always free

**Rationale**: Free = distribution. The library is the marketing. Never paywall the community harnesses.

### Team ($49/team/month)
- Private harness registry (publish + version internal harnesses)
- Team dashboard: which harnesses are deployed, usage analytics
- Harness diff viewer (visual diffs between versions)
- Slack/email notifications on harness updates

### Enterprise ($499/org/month or custom)
- SSO + RBAC for harness access control
- Audit logs (who deployed what harness when)
- Governance policy enforcement (enforce mandatory harnesses org-wide)
- Custom harness build service (we encode your review culture)
- SLA + dedicated support

---

## 8. Success Metrics

### Launch Metrics (Day 0–30)

| Metric | Target | Why |
|---|---|---|
| GitHub stars | 500 | Proxy for developer resonance |
| npm installs | 300 | Actual usage signal |
| HN front page | 1 appearance | Awareness spike |
| Active teams (using weekly) | 10 | Real retention signal |
| Community harnesses submitted | 3+ | Flywheel health |

### Growth Metrics (Day 30–90)

| Metric | Target | Why |
|---|---|---|
| GitHub stars | 2,000 | Momentum |
| Teams using HaC in prod | 50 | PMF signal |
| Enterprise pipeline | 5 conversations | Revenue path |
| Marketplace installs | 500 | Distribution channel health |
| Blog organic traffic | 5,000 visits/month | Top-of-funnel |

### North Star Metric

> **"Teams with active harness deployments"** — a team that has deployed and is regularly using at least 1 harness in their workflow.

This captures both adoption and retention. An installed harness that never runs doesn't count.

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Claude Code changes their plugin format, breaking compiled output | Medium | High | Abstract compiler so it can target multiple formats (Claude, Cursor, Copilot) |
| "Just use a CLAUDE.md file" objection | High | Medium | Demo the versioning, testing, and distribution advantages clearly. Show what breaks without HaC. |
| Anthropic builds this natively into Claude Code | Low | High | Race to community + enterprise lock-in before they do. Be the registry, not just the CLI. |
| Adoption limited to Claude Code users | Medium | Medium | Cross-model abstraction layer — compile to any AI coding tool format |
| Community harness quality is low | Medium | Low | Quality certification badge. Curate featured harnesses. Don't accept PRs without review. |
| Korea-only traction, hard to expand globally | Low | Medium | Lead with English content and global launch simultaneously |

---

## 10. 90-Day Execution Roadmap

```
Week 1–2   VALIDATE     Run with 3 internal teams. Gather feedback. Iterate.
Week 3–4   LAUNCH       GitHub, npm, HN, X. First 500 stars.
Week 5–8   GROW         Blog series. Community harnesses. Marketplace listing.
Week 9–12  MONETIZE     Enterprise outreach. Private registry MVP. First pilot.
```

---

## Open Questions to Validate

1. **Distribution format**: Should harnesses be npm packages (`npm install @harness/google-pr-review`) or a separate registry? npm = instant trust/tooling; own registry = control.

2. **Korea vs. global first**: The Toss blog signals strong Korean developer interest. Is there a case for going deep in Korea first (language support, Korean developer community), or launch globally from day 1?

3. **CLI vs. web app**: The beachhead is CLI users (platform engineers). But enterprise buyers want a UI. Build CLI-first, layer on a web UI at Day 60+?

4. **Anthropic partnership**: Given Thariq's tweet is essentially the product thesis, is there a path to a formal partnership or marketplace featured status? Worth pursuing in Week 1.
