import { z } from "zod";

// ─── Tool definitions ────────────────────────────────────────────────────────

export const ToolName = z.enum([
  // PR review tools
  "read_diff",       // read the full PR/MR diff
  "read_file",       // read a specific file for context
  "search_codebase", // grep/search patterns in the repo
  "post_inline",     // post inline comment on a specific line
  "post_summary",    // post overall PR summary comment
  "approve",         // approve the PR
  "request_changes", // formally request changes (blocks merge)
  "suggest_change",  // suggest a specific code change (GitHub suggestion block)
  // Feature development tools
  "write_file",      // create or modify a file
  "run_tests",       // execute test suite
  "create_branch",   // create a git branch
  "create_pr",       // open a pull request
  "create_ticket",   // create a task/issue in the ticketing system
  "run_linter",      // run linter/formatter
  "search_docs",     // search documentation
  "read_context",    // read project context / AGENTS.md / CLAUDE.md
]);

export type ToolName = z.infer<typeof ToolName>;

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
  "direct",        // Uber: clear, structured, signal-to-noise focused
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
  /**
   * - "net_positive": approve if code improves overall health (Google)
   * - "all_blocking_resolved": approve only when all blocking issues resolved
   * - "manual_only": never auto-approve; always human decision
   */
  strategy: z.enum(["net_positive", "all_blocking_resolved", "manual_only"]),
  /** Guiding principle to surface in the review summary */
  principle: z.string().optional(),
});

// ─── PR size policy ───────────────────────────────────────────────────────────

export const SizePolicy = z.object({
  /** Warn (but don't block) when PR exceeds this LOC */
  warn_above_loc: z.number().nullish(),
  /** Block review with message when PR exceeds this LOC */
  block_above_loc: z.number().nullish(),
  /** Advice to give when PR is too large */
  split_advice: z.string().nullish(),
});

// ─── HITL gates ───────────────────────────────────────────────────────────────

export const HitlAction = z.enum([
  "flag_for_security_review",  // escalate to security team
  "flag_for_domain_expert",    // needs specific domain expertise
  "require_human_approval",    // block until a human explicitly approves
  "request_architecture_review", // escalate to staff/principal engineer
  "notify_only",               // inform stakeholders without blocking
]);

export const HitlGate = z.object({
  /** Plain-English condition that triggers this gate */
  trigger: z.string(),
  action: HitlAction,
  /** Explanation shown to the reviewer */
  message: z.string(),
});

// ─── Special focus areas ──────────────────────────────────────────────────────

export const SpecialFocus = z.object({
  name: z.string(),
  description: z.string(),
  /** Patterns/keywords that activate this focus */
  activate_on: z.array(z.string()).default([]),
  /** Additional instructions to apply */
  instructions: z.string(),
});

// ─── Root harness schema ──────────────────────────────────────────────────────

export const HarnessSchema = z.object({
  /** Unique identifier for this harness */
  name: z.string(),
  version: z.string(),
  description: z.string(),
  /** Company/style this harness is based on */
  inspired_by: z.string().optional(),
  /** Link to source documentation */
  source_url: z.string().optional(),

  action_space: z.object({
    tools: z.array(ToolName),
  }),

  review_criteria: ReviewCriteria,
  comment_style: CommentStyle,
  severity: SeveritySystem,
  approval: ApprovalPolicy,
  size: SizePolicy.optional(),
  hitl_gates: z.array(HitlGate).default([]),
  /** Domain-specific focus areas (e.g. accessibility, API contracts) */
  special_focus: z.array(SpecialFocus).default([]),
});

export type Harness = z.infer<typeof HarnessSchema>;
