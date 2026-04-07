# Product Brainstorm: Harness Engineering Platform

**Date**: 2026-04-06  
**Stage**: Initial Discovery  
**Author**: Claude Code (pm-product-discovery:brainstorm-ideas-new)

---

## Opportunity Summary

**What is "Harness Engineering"?**

From Thariq's tweet (Claude Code engineer, 11K likes, 1.6K reposts):
> "One of the hardest parts of building an agent harness is constructing its action space."

The action space is *which tools the agent can use*, at what granularity, shaped to what the model can actually do. From the Toss Tech blog: the downstream application is packaging action spaces as **team-deployable harnesses** (Claude Code skills/plugins) that raise the floor of LLM productivity org-wide.

**Business Idea**: A platform formalizing the two-step pipeline:
1. **Define the action space** — structured definition of tools, permissions, HITL gates
2. **Convert to harness** — compile into deployable Claude Code skills, CLAUDE.md configs, hooks, slash commands

**Target Segment**: Engineering teams adopting AI coding assistants — platform engineers, tech leads, "LLM-power-users" who want to standardize AI usage across their org.

**Core Problem**: Today, building a harness is artisanal. Every team reinvents it. The action space → harness pipeline has no tooling, no standards, no distribution mechanism.

**Desired Outcome**: Define once, deploy everywhere, iterate with data.

---

## Ideation: 3 Perspectives

### Product Manager — Market Fit & Competitive Advantage

1. **Workflow Template Marketplace** — Pre-built action space templates for common engineering workflows ("new-feature", "code-review", "incident-response") installable in one command. Network effects: every published harness makes the platform more valuable.

2. **Harness Governance Layer** — Embed org-wide rules into the harness: "never commit to main," "always create Jira ticket before branching," "require human approval for DB migrations." Policy-as-code for AI agent behavior.

3. **ROI & Productivity Analytics** — Track which harnesses fire, which actions fail, where humans override (HITL). Helps enterprise buyers justify spend and surface which harnesses need improvement.

4. **Private Registry (npm for Harnesses)** — Enterprise-grade private registry: publish, version, distribute harnesses internally. Access control, audit logs, semantic versioning.

5. **Harness Certification Program** — Quality/safety certification badge for marketplace harnesses. Builds trust layer for enterprise adoption. Differentiates community signal from noise.

### Product Designer — UX, Onboarding & Engagement

1. **Visual Action Space Designer** — Drag-and-drop canvas mapping agent tools as a node graph: inputs, outputs, dependencies, trigger conditions. Figma for agent design.

2. **Harness Simulation Playground** — Type a sample user request → watch harness execute in sandboxed dry run (which tools fire, HITL gates, success/failure paths). Validate before deploying.

3. **Conversational Harness Builder** — "What do you want your AI agent to do?" → guided interview → auto-generated starter harness. Zero-friction onboarding for non-technical team leads.

4. **Before/After Diff Viewer** — Visual diff on harness version updates showing exactly how agent behavior changes. Prevents surprise regressions on shared team harnesses.

5. **Team Feedback Loop UI** — One-click "agent did something wrong here" flag in IDE or web app. Feeds back into harness refinement. Every teammate becomes a QA tester.

### Software Engineer — Technical Innovation & Platform

1. **Harness-as-Code (HaC) Framework** — Declarative YAML/TOML schema for action spaces: tools, permissions, HITL gates, hooks, slash commands. Schema-validated, CI/CD-friendly. `harness validate`, `harness build`, `harness deploy`. Terraform for AI agent action spaces.

2. **Automated Action Space Optimizer** — Analyzes execution logs: tools never called (dead weight), tools frequently erroring (need redesign), actions where humans always override (need HITL gate). Data-driven harness improvement.

3. **Cross-Model Abstraction Layer** — Write action space once, compile to Claude Code skills + Cursor rules + Copilot instructions. Model-agnostic portability. Moat when teams use multiple AI tools.

4. **Harness Testing Utilities** — Unit-test harnesses like code: `assert agent("fix bug").calls_tool("Grep")`, `assert agent("push to prod").requires_human_approval()`. Systematic QA for agent behavior.

5. **Data Flywheel Pipeline** — Structured execution logs from deployed harnesses → auto-formatted instruction-tuning datasets → ready for domain-specific model fine-tuning.

---

## Top 5 Prioritized Ideas

Weighted toward: core value delivery, speed to validate, differentiation potential.

### #1 — Harness-as-Code (HaC) CLI Framework
The core primitive the entire business sits on. Action space → harness conversion needs a formal spec without which nothing else works.  
**Assumptions to test**: Will teams adopt a new YAML schema, or prefer UI-first? Does the format need to be Claude-specific or cross-model from day one?

### #2 — Conversational Harness Builder (Web Onboarding)
Lowers activation energy to zero for the 80% who know their workflow but can't write schemas. Also the fastest sales demo.  
**Assumptions to test**: Can a structured interview produce a harness good enough for real use, or is output too generic?

### #3 — Workflow Template Marketplace
Network effects + immediate day-one value. A new team gets instant ROI by installing a "new-feature" or "code-review" harness. Fastest signal on what workflows teams actually need.  
**Assumptions to test**: Will teams share harnesses publicly, or is this too sensitive? Is community content high-quality enough to drive trust?

### #4 — Harness Simulation Playground
Removes the #1 blocker: fear of unintended agent behavior. "Try before you deploy" directly addresses this. Also a powerful enterprise sales tool.  
**Assumptions to test**: Can simulation be accurate enough to predict real behavior? What fidelity is "good enough"?

### #5 — Harness Governance Layer
Enterprise sales hook. A CTO can justify "AI governance" far more easily than "AI productivity." Hard technical moat — encoding org policy into agent behavior is complex.  
**Assumptions to test**: Are teams ready to formally define AI governance policies? Does this need to integrate with OPA/Sentinel?

---

## Riskiest Assumption to Validate First

> "Teams will invest time formally defining their action space."

Today, high-performers do this informally (like engineer A in the Toss blog). The thesis is that you can make this formal, repeatable, and transferable. **Fastest validation**: manually build harnesses for 3-5 engineering teams and observe whether they actually use and iterate on them — before building any tooling.

---

## References
- [Toss Tech: Harness for Team Productivity](https://toss.tech/article/harness-for-team-productivity)
- [Thariq: Lessons from Building Claude Code](https://x.com/trq212/status/2027463795355095314)
