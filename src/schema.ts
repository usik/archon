import { z } from "zod";

// ─── Observation tools (read / perceive) ─────────────────────────────────────
// What the agent can SEE. No side effects.

export const ObservationTool = z.enum([
  "read_diff",       // read the full PR/MR diff
  "read_file",       // read a specific file for context
  "search_codebase", // grep/search patterns in the repo
  "search_docs",     // search documentation
  "read_context",    // read project context (AGENTS.md, CLAUDE.md, README)
]);

export type ObservationTool = z.infer<typeof ObservationTool>;

// ─── Action tools (write / execute) ──────────────────────────────────────────
// What the agent can DO. Has side effects.

export const ActionTool = z.enum([
  // Review actions
  "post_inline",     // post inline comment on a specific line
  "post_summary",    // post overall PR/task summary comment
  "approve",         // approve the PR
  "request_changes", // formally request changes (blocks merge)
  "suggest_change",  // suggest a specific code change (GitHub suggestion block)
  // Development actions
  "write_file",      // create or modify a file
  "run_tests",       // execute test suite
  "run_linter",      // run linter/formatter
  "create_branch",   // create a git branch
  "create_pr",       // open a pull request
  "create_ticket",   // create a task/issue in the ticketing system
]);

export type ActionTool = z.infer<typeof ActionTool>;

// ─── Review criteria ─────────────────────────────────────────────────────────

export const ReviewCriterion = z.object({
  name: z.string(),
  description: z.string(),
  /** If set, only check this criterion when the trigger condition is met */
  trigger: z.string().optional(),
  /** Weight for scoring (1-3, higher = more important) */
  weight: z.number().min(1).max(3).default(2),
});

export const ReviewCriteria = z.object({
  /** Criteria always checked */
  required: z.array(ReviewCriterion),
  /** Criteria checked only under certain conditions */
  conditional: z.array(ReviewCriterion).default([]),
});

// ─── Comment style ────────────────────────────────────────────────────────────

export const CommentTone = z.enum([
  "mentoring",     // Google: explain the why, use Nit:, encourage learning
  "direct",        // Uber/AWS: clear, structured, signal-to-noise focused
  "collaborative", // Shopify/Microsoft: "we" language, treat as shared code
  "trust_based",   // Netflix: minimal friction, high autonomy
  "supportive",    // LinkedIn/Airbnb: growth mindset, professional development
]);

export const CommentStyle = z.object({
  tone: CommentTone,
  /** Prefix for non-blocking suggestions (e.g. "Nit:", "Optional:") */
  nit_prefix: z.string().default("Nit:"),
  /** Whether to always explain why a change is needed */
  require_explanation: z.boolean().default(true),
  /** Whether to call out well-executed code with affirmations */
  affirmations: z.boolean().default(false),
  /** Use "we/our" language instead of "you/your" */
  collective_ownership: z.boolean().default(false),
  /** Max comment length before suggesting a discussion instead */
  max_comment_length: z.number().optional(),
});

// ─── Severity system ──────────────────────────────────────────────────────────

export const SeverityLevel = z.enum([
  "blocking",     // must be fixed before merge
  "non_blocking", // should be addressed but won't block merge
  "nit",          // minor style/preference, optional
  "praise",       // positive feedback
]);

export const SeveritySystem = z.object({
  /** Issue types that are always blocking */
  blocking_triggers: z.array(z.string()),
  /** Issue types that are always non-blocking */
  non_blocking_triggers: z.array(z.string()),
  /** Default severity when uncertain */
  default: SeverityLevel.default("non_blocking"),
});

// ─── Approval policy ─────────────────────────────────────────────────────────

export const ApprovalPolicy = z.object({
  strategy: z.enum(["net_positive", "all_blocking_resolved", "manual_only"]),
  /** Guiding principle to surface in the review summary */
  principle: z.string().optional(),
});

// ─── PR size policy ───────────────────────────────────────────────────────────

export const SizePolicy = z.object({
  warn_above_loc: z.number().nullish(),
  block_above_loc: z.number().nullish(),
  split_advice: z.string().nullish(),
});

// ─── HITL gates ───────────────────────────────────────────────────────────────

export const HitlAction = z.enum([
  "flag_for_security_review",    // escalate to security team
  "flag_for_domain_expert",      // needs specific domain expertise
  "require_human_approval",      // block until a human explicitly approves
  "request_architecture_review", // escalate to staff/principal engineer
  "notify_only",                 // inform stakeholders without blocking
]);

export const HitlGate = z.object({
  trigger: z.string(),
  action: HitlAction,
  message: z.string(),
});

// ─── Deployment mode ──────────────────────────────────────────────────────────
//
//  solo     — Claude Code (subscription). Single-agent, interactive, no persistent state.
//  team     — OpenHarness (API key). Headless, agentic loops, stateful, handoffs.
//  company  — Paperclip + OpenHarness. Multi-agent org chart, budgets, governance.
//
//  Modes are inclusive upward: a solo harness runs anywhere.
//  A team harness needs OpenHarness or Claude Code in agent mode.
//  A company harness needs Paperclip to orchestrate.

export const HarnessMode = z.enum(["solo", "team", "company"]);
export type HarnessMode = z.infer<typeof HarnessMode>;

export const HarnessTargets = z.object({
  /** Minimum runtime required to run this harness */
  mode: HarnessMode,

  // Solo-specific
  claude_code: z.object({
    /** Slash command users type in Claude Code. Defaults to /<harness.name> */
    slash_command: z.string().optional(),
  }).optional(),

  // Team-specific
  openharness: z.object({
    /** Skill name under ~/.openharness/skills/ */
    skill_path: z.string().optional(),
  }).optional(),

  // Company-specific
  paperclip: z.object({
    /** Agent slot in the org chart this harness fills */
    role_id: z.string().optional(),
    /** Mirrors manifest.yaml reports_to — makes harness self-describing */
    reports_to: z.string().optional(),
    budget_monthly_usd: z.number().optional(),
  }).optional(),
});
export type HarnessTargets = z.infer<typeof HarnessTargets>;

// ─── Mode inference ───────────────────────────────────────────────────────────
// Deterministically infer mode from harness structure when targets.mode is absent.

export function inferMode(harness: {
  loop?: { style?: string };
  handoffs?: unknown[];
  memory?: { persist_after_task?: unknown[] };
  hitl_gates?: Array<{ action: string }>;
  targets?: { mode?: string; paperclip?: { reports_to?: string; role_id?: string } };
}): HarnessMode {
  if (harness.targets?.paperclip?.reports_to || harness.targets?.paperclip?.role_id) return "company";
  if (harness.loop?.style === "agentic") return "team";
  if ((harness.handoffs?.length ?? 0) > 0) return "team";
  if ((harness.memory?.persist_after_task?.length ?? 0) > 0) return "team";
  const teamGates = ["notify_only", "flag_for_security_review", "flag_for_domain_expert"];
  if (harness.hitl_gates?.some(g => teamGates.includes(g.action))) return "team";
  return "solo";
}

// ─── Agent loop model ─────────────────────────────────────────────────────────
// Defines the execution pattern: linear (review) vs. agentic (iterative dev).

export const LoopStyle = z.enum([
  "linear",   // read → analyze → output once (PR review, security audit)
  "agentic",  // plan → act → observe → reflect → repeat (feature dev, ops)
]);

export const AgentLoop = z.object({
  /** Execution pattern */
  style: LoopStyle,
  /** Max tool-call cycles before stopping and asking for human input */
  max_iterations: z.number().default(10),
  /** Require explicit reasoning before any action tool call */
  think_before_act: z.boolean().default(false),
  /** After each action, observe the result and adjust plan before next action */
  reflect_after_act: z.boolean().default(false),
  /** When stuck (tool error or no progress for N iterations), what to do */
  on_stuck: z.enum(["escalate_to_human", "create_ticket", "stop"]).default("escalate_to_human"),
});

// ─── Grounding rules ──────────────────────────────────────────────────────────
// Evidence requirements that must be satisfied before an action is allowed.
// Prevents hallucinated comments and unsubstantiated decisions.

export const GroundingRule = z.object({
  /** Human-readable label for this rule */
  name: z.string(),
  /** Which action tool this rule applies to */
  applies_to: ActionTool,
  /** What evidence must exist in the observation space before this action is taken */
  require: z.string(),
});

// ─── Memory seeds ─────────────────────────────────────────────────────────────
// Files / context to load at task start, before any observation or action.
// This is what the agent "knows going in" — not what it discovers during the task.

export const MemorySeeds = z.object({
  /** Files to always read at task start (paths relative to repo root, or glob) */
  always_read: z.array(z.string()).default([]),
  /** Patterns to search for relevant context (e.g. "CHANGELOG", "ADR-*.md") */
  context_patterns: z.array(z.string()).default([]),
  /** What the agent should persist to memory after completing the task */
  persist_after_task: z.array(z.string()).default([]),
});

// ─── Handoff format ───────────────────────────────────────────────────────────
// Defines the structured output this agent produces for downstream agents.
// Makes inter-agent communication explicit and machine-readable.

export const HandoffFormat = z.object({
  /** What downstream agent role consumes this output */
  to_role: z.string(),
  /** Output format: structured sections this agent always produces */
  output_sections: z.array(z.string()),
  /** Fields that must be present for the handoff to be valid */
  required_fields: z.array(z.string()).default([]),
  /** Plain-English description of what a valid handoff looks like */
  description: z.string(),
});

// ─── Provider hint ────────────────────────────────────────────────────────────
// Suggests which model tier this harness needs. Runtime may override.

export const ProviderHint = z.object({
  /**
   * - "high_reasoning": complex decisions, architecture, security (Opus/o1-level)
   * - "balanced": standard dev/review tasks (Sonnet-level)
   * - "fast": simple, repetitive tasks (Haiku/mini-level)
   */
  tier: z.enum(["high_reasoning", "balanced", "fast"]),
  /** Why this tier is needed */
  reason: z.string().optional(),
});

// ─── Special focus areas ──────────────────────────────────────────────────────

export const SpecialFocus = z.object({
  name: z.string(),
  description: z.string(),
  activate_on: z.array(z.string()).default([]),
  instructions: z.string(),
});

// ─── Root harness schema (OAKP model) ─────────────────────────────────────────
//
//  O — Observation space  what the agent can perceive (read-only)
//  A — Action space       what the agent can do (has side effects)
//  K — Knowledge          domain criteria + special focus areas
//  P — Permission         hitl_gates + severity + approval policy

export const HarnessSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  inspired_by: z.string().optional(),
  source_url: z.string().optional(),

  // O — Observation space
  observation_space: z.array(ObservationTool),

  // A — Action space
  action_space: z.array(ActionTool),

  // K — Knowledge (review_criteria + special_focus)
  review_criteria: ReviewCriteria,
  special_focus: z.array(SpecialFocus).default([]),

  // P — Permission (hitl_gates + severity + approval + size)
  hitl_gates: z.array(HitlGate).default([]),
  severity: SeveritySystem,
  approval: ApprovalPolicy,
  size: SizePolicy.optional(),

  // ── Deployment targets ────────────────────────────────────────────────────
  /** Minimum runtime required and per-runtime configuration */
  targets: HarnessTargets.optional(),

  // ── Agent runtime hints (borrowed from OpenHarness model) ──────────────────
  /** Execution loop model: linear review vs. agentic iteration */
  loop: AgentLoop.optional(),
  /** Evidence requirements before action tools can fire */
  grounding: z.array(GroundingRule).default([]),
  /** Context to load at task start */
  memory: MemorySeeds.optional(),
  /** Structured output format for downstream agents */
  handoffs: z.array(HandoffFormat).default([]),
  /** Model tier hint for the runtime */
  provider_hint: ProviderHint.optional(),

  // Comment style (output formatting)
  comment_style: CommentStyle,
});

export type Harness = z.infer<typeof HarnessSchema>;
