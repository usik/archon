import type { Harness } from "./schema.js";

/**
 * Compiles a Harness definition into a Claude Code skill (SKILL.md).
 * The output is a markdown file that Claude reads as its instruction set
 * when performing a PR review.
 */
export function compile(harness: Harness): string {
  const lines: string[] = [];

  // ── Frontmatter ────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push(`name: ${harness.name}`);
  lines.push(`version: ${harness.version}`);
  lines.push(`description: "${harness.description.trim().replace(/\n/g, " ")}"`);
  if (harness.inspired_by) lines.push(`inspired_by: ${harness.inspired_by}`);
  if (harness.source_url) lines.push(`source_url: ${harness.source_url}`);
  lines.push("---");
  lines.push("");

  // ── Header ────────────────────────────────────────────────────────────────
  const title = harness.name
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
  lines.push(`# ${title}`);
  lines.push("");
  lines.push(harness.description.trim());
  if (harness.inspired_by && harness.source_url) {
    lines.push("");
    lines.push(
      `> Inspired by [${harness.inspired_by} engineering practices](${harness.source_url})`
    );
  }
  lines.push("");

  // ── Action Space ─────────────────────────────────────────────────────────
  lines.push("## Action Space");
  lines.push("");
  lines.push(
    "You have access to the following tools. Use only what is necessary."
  );
  lines.push("");
  const toolDescriptions: Record<string, string> = {
    read_diff: "**read_diff** — Read the full PR diff to understand all changes",
    read_file:
      "**read_file** — Read a complete file for context beyond the diff",
    search_codebase:
      "**search_codebase** — Search/grep the codebase for patterns, usages, or related code",
    post_inline:
      "**post_inline** — Post an inline comment on a specific line of the diff",
    post_summary: "**post_summary** — Post an overall PR summary comment",
    approve: "**approve** — Approve the PR (use only when all blocking issues are resolved)",
    request_changes:
      "**request_changes** — Formally request changes (blocks merge until resolved)",
    suggest_change:
      "**suggest_change** — Propose a specific code replacement via a suggestion block",
  };
  for (const tool of harness.action_space.tools) {
    lines.push(`- ${toolDescriptions[tool] ?? `**${tool}**`}`);
  }
  lines.push("");

  // ── Review Process ────────────────────────────────────────────────────────
  lines.push("## Review Process");
  lines.push("");
  lines.push(
    "Follow these steps in order. Do not skip steps or reorder them."
  );
  lines.push("");

  // Step 1: Read
  lines.push("### Step 1 — Read the Diff");
  lines.push("");
  lines.push(
    "Use `read_diff` to read the full PR diff. Form an initial mental model:"
  );
  lines.push("- What is this PR trying to accomplish?");
  lines.push("- What files are changed and why?");
  lines.push("- Are there any immediate red flags?");
  lines.push("");

  // Size check
  if (harness.size) {
    const warnLoc = harness.size.warn_above_loc;
    const blockLoc = harness.size.block_above_loc;
    if (warnLoc || blockLoc) {
      lines.push("### Step 2 — Size Check");
      lines.push("");
      if (blockLoc) {
        lines.push(
          `If the PR exceeds **${blockLoc} lines of code changed**, stop and post a `+
          "`request_changes`" +
          ` comment with the following advice:`
        );
        lines.push("");
        lines.push("```");
        lines.push(harness.size.split_advice ?? "This PR is too large to review effectively. Please split it into smaller, focused changes.");
        lines.push("```");
        lines.push("");
      } else if (warnLoc) {
        lines.push(
          `If the PR exceeds **${warnLoc} lines of code changed**, include a note in your summary:`
        );
        lines.push("");
        lines.push("```");
        lines.push(harness.size.split_advice ?? "Consider splitting this PR into smaller changes for easier review.");
        lines.push("```");
        lines.push("");
      }
    }
  }

  // Step 3: Gather context
  lines.push("### Step 3 — Gather Context");
  lines.push("");
  lines.push(
    "Use `read_file` and `search_codebase` to understand the surrounding context:"
  );
  lines.push("- Read files that are heavily modified");
  lines.push("- Search for usages of changed functions/methods");
  lines.push("- Look for existing patterns the change should follow");
  lines.push("- Check for related tests");
  lines.push("");

  // Step 4: Apply review criteria
  lines.push("### Step 4 — Apply Review Criteria");
  lines.push("");
  lines.push(
    "Check each criterion below. For each issue found, determine its severity."
  );
  lines.push("");

  lines.push("#### Required Checks");
  lines.push("");
  const sortedRequired = [...harness.review_criteria.required].sort(
    (a, b) => b.weight - a.weight
  );
  for (const criterion of sortedRequired) {
    const weightLabel = criterion.weight === 3 ? "🔴 High" : criterion.weight === 2 ? "🟡 Medium" : "🟢 Low";
    lines.push(`**${criterion.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}** (${weightLabel} priority)`);
    lines.push("");
    lines.push(criterion.description.trim());
    lines.push("");
  }

  if (harness.review_criteria.conditional.length > 0) {
    lines.push("#### Conditional Checks");
    lines.push("");
    lines.push(
      "Apply these checks only when the indicated condition is met:"
    );
    lines.push("");
    for (const criterion of harness.review_criteria.conditional) {
      lines.push(
        `**${criterion.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}** _(when: ${criterion.trigger})_`
      );
      lines.push("");
      lines.push(criterion.description.trim());
      lines.push("");
    }
  }

  // ── Severity System ───────────────────────────────────────────────────────
  lines.push("## Severity System");
  lines.push("");
  lines.push("Classify every comment with a severity level:");
  lines.push("");
  lines.push(
    "| Severity | Label | Meaning |"
  );
  lines.push("| --- | --- | --- |");
  lines.push(
    "| **Blocking** | `[Blocking]` | Must be fixed before merge. Use `request_changes`. |"
  );
  lines.push(
    `| **Non-blocking** | \`[Suggestion]\` | Should be addressed but won't block merge. |`
  );
  lines.push(
    `| **Nit** | \`${harness.comment_style.nit_prefix}\` | Minor style/preference. Completely optional. |`
  );
  if (harness.comment_style.affirmations) {
    lines.push(
      "| **Praise** | `[Praise]` | Call out well-executed code. Don't skip this. |"
    );
  }
  lines.push("");
  lines.push("**Blocking triggers** (always use `request_changes` for these):");
  for (const trigger of harness.severity.blocking_triggers) {
    lines.push(`- ${trigger.replace(/_/g, " ")}`);
  }
  lines.push("");
  lines.push(
    `**Default severity** when uncertain: ${harness.severity.default}`
  );
  lines.push("");

  // ── Comment Style ─────────────────────────────────────────────────────────
  lines.push("## Comment Style");
  lines.push("");

  const toneInstructions: Record<string, string> = {
    mentoring: `**Tone: Mentoring**
Write comments as a mentor helping a colleague grow. Explain the *why* behind every
suggestion, not just the *what*. Prefix non-blocking feedback with "${harness.comment_style.nit_prefix}".
Technical facts and data override personal opinions — if you're expressing a preference,
say so explicitly. Call out well-executed code with brief praise.`,

    direct: `**Tone: Direct**
Write comments that are precise and actionable. State exactly what the issue is and what
the fix should be. Avoid hedging. Quality over quantity — if you're not confident it's
a real issue, don't post it. Merge related comments into one rather than flooding the PR.`,

    collaborative: `**Tone: Collaborative**
Use "we/our" language throughout. This is *our code*, not *your code*. Ask questions
rather than making declarations: "Could we consider X?" over "You should do X."
Distinguish clearly between blocking issues and optional suggestions so authors know
exactly what must change vs. what's up to them.`,

    trust_based: `**Tone: Trust-based**
Minimal friction. Trust the author as the expert on their own code. Focus on correctness
and safety issues only. Avoid nitpicking style. If it works correctly and safely, approve it.
Your job is to catch bugs and security issues, not impose preferences.`,

    supportive: `**Tone: Supportive**
Frame every comment as an opportunity for growth. Acknowledge what's done well before
pointing out what could be better. Use a growth mindset — "this is an opportunity to..."
rather than "this is wrong." Authors should feel energized after reading your review, not deflated.`,
  };

  lines.push(
    toneInstructions[harness.comment_style.tone] ??
      `**Tone: ${harness.comment_style.tone}**`
  );
  lines.push("");

  if (harness.comment_style.require_explanation) {
    lines.push(
      "**Always explain why**: Every blocking comment must explain why the change is needed, " +
      "not just what to change. Vague feedback wastes the author's time."
    );
    lines.push("");
  }

  if (harness.comment_style.max_comment_length) {
    lines.push(
      `**Comment length**: Keep inline comments under ${harness.comment_style.max_comment_length} characters. ` +
      "If a concern requires more, suggest a discussion or pairing session instead."
    );
    lines.push("");
  }

  // ── HITL Gates ────────────────────────────────────────────────────────────
  if (harness.hitl_gates.length > 0) {
    lines.push("## Human-in-the-Loop (HITL) Gates");
    lines.push("");
    lines.push(
      "Stop and escalate to a human when any of the following conditions are met. " +
      "Do NOT proceed past these gates automatically."
    );
    lines.push("");

    const actionLabels: Record<string, string> = {
      flag_for_security_review: "🔒 Escalate to Security Team",
      flag_for_domain_expert: "🧑‍💼 Escalate to Domain Expert",
      require_human_approval: "🛑 Block — Require Human Approval",
      require_architecture_review: "🏛️ Escalate to Architecture Review",
      notify_only: "📣 Notify Stakeholders",
    };

    for (const gate of harness.hitl_gates) {
      lines.push(
        `### ${actionLabels[gate.action] ?? gate.action}: ${gate.trigger.replace(/_/g, " ")}`
      );
      lines.push("");
      lines.push(gate.message.trim());
      lines.push("");
    }
  }

  // ── Special Focus Areas ────────────────────────────────────────────────────
  if (harness.special_focus.length > 0) {
    lines.push("## Special Focus Areas");
    lines.push("");
    lines.push(
      "Apply these additional checks when the indicated patterns are present:"
    );
    lines.push("");

    for (const focus of harness.special_focus) {
      lines.push(`### ${focus.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`);
      lines.push("");
      lines.push(focus.description.trim());
      if (focus.activate_on.length > 0) {
        lines.push("");
        lines.push(
          `_Activate when diff contains:_ \`${focus.activate_on.join("`, `")}\``
        );
      }
      lines.push("");
      lines.push(focus.instructions.trim());
      lines.push("");
    }
  }

  // ── Approval Decision ─────────────────────────────────────────────────────
  lines.push("## Approval Decision");
  lines.push("");

  const approvalInstructions: Record<string, string> = {
    net_positive:
      "**Approve** if the change definitively improves overall code health — even if imperfect. " +
      "Don't block on hypothetical improvements. A CL that improves things 70% is worth merging.",
    all_blocking_resolved:
      "**Approve** only when all blocking issues have been resolved. " +
      "Non-blocking suggestions can remain open.",
    manual_only:
      "**Do not approve automatically.** Post your summary and let the human reviewer make the final call.",
  };

  lines.push(
    approvalInstructions[harness.approval.strategy] ??
      harness.approval.strategy
  );
  lines.push("");

  if (harness.approval.principle) {
    lines.push(`> **Guiding Principle**: ${harness.approval.principle.trim()}`);
    lines.push("");
  }

  // ── Review Summary Format ─────────────────────────────────────────────────
  lines.push("## Review Summary Format");
  lines.push("");
  lines.push("End every review with a `post_summary` comment using this format:");
  lines.push("");
  lines.push("```");
  lines.push("## PR Review Summary");
  lines.push("");
  lines.push("**Overview**: [1-2 sentence summary of what the PR does]");
  lines.push("");
  lines.push("**Verdict**: [APPROVE | REQUEST CHANGES | NEEDS DISCUSSION]");
  lines.push("");
  lines.push("**Blocking issues** (must fix before merge):");
  lines.push("- [list or 'None']");
  lines.push("");
  lines.push("**Suggestions** (optional improvements):");
  lines.push("- [list or 'None']");
  if (harness.comment_style.affirmations) {
    lines.push("");
    lines.push("**Highlights** (well-executed):");
    lines.push("- [list what was done well]");
  }
  lines.push("```");
  lines.push("");

  return lines.join("\n");
}

/**
 * Generates the slash command file that lets users invoke this harness
 * as `/review-pr` inside Claude Code.
 */
export function compileSlashCommand(harness: Harness): string {
  const lines: string[] = [];

  lines.push(`# /${harness.name}`);
  lines.push("");
  lines.push(harness.description.trim());
  lines.push("");
  lines.push("## Usage");
  lines.push("");
  lines.push("```");
  lines.push(`/${harness.name} [PR number or diff path]`);
  lines.push("```");
  lines.push("");
  lines.push("## Instructions");
  lines.push("");
  lines.push(
    `You are performing a code review using the **${harness.name}** harness.`
  );
  lines.push(`Load and follow the skill file for this harness exactly.`);
  lines.push("");
  lines.push(
    "Start by using `read_diff` to read the PR changes, then follow the " +
    "review process defined in the harness step by step."
  );

  return lines.join("\n");
}
