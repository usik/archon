# OpenHarness Integration

HarnessMart harnesses compile to SKILL.md files that OpenHarness loads natively.
No adaptation required — OpenHarness reads `.md` skill files from `~/.openharness/skills/`.

## Deploy a harness to OpenHarness

```bash
# Deploy a single harness
harness deploy harnesses/engineering/feature-dev/toss.yaml --target openharness

# Deploy all harnesses
harness deploy-all --target openharness

# Verify deployment
ls ~/.openharness/skills/
```

## Use in OpenHarness

```bash
# Launch OpenHarness with a specific skill active
oh --skill toss-feature-dev -p "Implement dark mode toggle for the settings page"

# Or reference the skill in your prompt
oh -p "/toss-feature-dev Implement the new user onboarding flow"
```

## How It Works

```
harnesses/engineering/feature-dev/toss.yaml
           ↓ harness build
compiled/toss-feature-dev/SKILL.md
           ↓ harness deploy --target openharness
~/.openharness/skills/toss-feature-dev/toss-feature-dev.md
           ↓ oh --skill toss-feature-dev
Agent runs with Toss engineering culture encoded
```

## Provider Setup

OpenHarness supports Claude, GPT-5, Codex, HyperCLOVA X, EXAONE, Kimi, and more.

```bash
# Install OpenHarness
curl -fsSL https://raw.githubusercontent.com/HKUDS/OpenHarness/main/scripts/install.sh | bash

# Configure provider (Claude)
oh setup

# Configure Korean LLM (HyperCLOVA X)
oh provider add hyperclova \
  --label "HyperCLOVA X" \
  --provider anthropic \
  --api-format anthropic \
  --base-url https://clovastudio.stream.ntruss.com/anthropic \
  --model HCX-005
```

## Acknowledgement

OpenHarness is built by [HKUDS](https://github.com/HKUDS/OpenHarness) (6.4K★ MIT).
HarnessMart harnesses are compatible with OpenHarness out of the box.
We are grateful to the OpenHarness team for building the execution layer.
