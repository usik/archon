# Paperclip Integration

Paperclip is the orchestration layer — it manages agent org charts, goals, budgets,
and governance. HarnessMart provides the harnesses that define how each agent behaves.

Together: Paperclip tells agents *who they are*. HarnessMart tells agents *how to work*.

## Quick Start

```bash
# 1. Install Paperclip
npx paperclipai onboard --yes

# 2. Install HarnessMart harnesses to OpenHarness (the agent runtime)
harness deploy-all --target openharness

# 3. Import a company template into Paperclip
# Open Paperclip UI → Companies → Import → paste templates/korean-startup/paperclip.json
```

## Using a Company Template

Company templates bundle Paperclip org config + HarnessMart harness assignments:

```
templates/korean-startup/
├── paperclip.json    ← Import this into Paperclip
└── manifest.yaml     ← Harness assignments per agent role
```

Each agent in the Paperclip org chart has a `skill` field pointing to a HarnessMart harness.
When that agent runs via OpenHarness, it loads its assigned harness automatically.

## How the Stack Connects

```
Human
  │ defines goals
  ▼
Paperclip (company layer)
  │ org charts · goals · budgets · heartbeats
  │ spawns agents with assigned roles
  ▼
OpenHarness (runtime layer)
  │ tool execution · provider routing · memory
  │ loads skill from ~/.openharness/skills/
  ▼
HarnessMart Harness (behavior layer)      ← this is us
  │ action space · domain knowledge · HITL gates
  ▼
LLM (Claude / GPT-5 / HyperCLOVA X)
```

## Wiring an Agent in Paperclip to a HarnessMart Harness

In `paperclip.json`, set the `skill` field for each agent:

```json
{
  "id": "backend_1",
  "name": "Backend Engineer",
  "skill": "toss-feature-dev",
  "runtime": "openharness"
}
```

When Paperclip triggers this agent, OpenHarness loads `toss-feature-dev` from
`~/.openharness/skills/` and the agent behaves according to Toss engineering culture.

## Acknowledgement

Paperclip is built by [paperclipai](https://github.com/paperclipai/paperclip) (48.8K★ MIT).
HarnessMart provides the harness library and company templates for Paperclip's KR/JP ecosystem.
We are grateful to the Paperclip team for building the orchestration layer.
