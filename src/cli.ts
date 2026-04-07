#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { mkdirSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { loadHarness, listHarnesses } from "./loader.js";
import { compile, compileSlashCommand } from "./compiler.js";
import { inferMode, type HarnessMode } from "./schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_HARNESSES_DIR = join(__dirname, "../harnesses");
const DEFAULT_OUTPUT_DIR = join(__dirname, "../compiled");

const program = new Command();

program
  .name("harness")
  .description("Harness-as-Code CLI — define agent action spaces, compile to Claude Code skills")
  .version("0.1.0");

// ── Helpers ───────────────────────────────────────────────────────────────────

const MODE_LABELS: Record<HarnessMode, string> = {
  solo:    chalk.blue("solo   "),
  team:    chalk.yellow("team   "),
  company: chalk.magenta("company"),
};

const MODE_RUNTIME: Record<HarnessMode, string> = {
  solo:    "Claude Code (subscription)",
  team:    "OpenHarness (API key)",
  company: "Paperclip + OpenHarness",
};

// Default deploy target by mode: solo→claude, team/company→openharness
const DEPLOY_TARGETS: Record<string, (name: string) => string> = {
  openharness: () => join(homedir(), ".openharness", "skills"),
  claude:      () => join(homedir(), ".claude", "skills"),
  local:       (name) => join(DEFAULT_OUTPUT_DIR, name),
};

function defaultTarget(mode: HarnessMode): string {
  return mode === "solo" ? "claude" : "openharness";
}

// ── harness list ──────────────────────────────────────────────────────────────

program
  .command("list")
  .description("List all available harness definitions")
  .option("-d, --dir <path>", "Harness directory", DEFAULT_HARNESSES_DIR)
  .action((opts) => {
    const files = listHarnesses(opts.dir);

    if (files.length === 0) {
      console.log(chalk.yellow(`No harnesses found in ${opts.dir}`));
      return;
    }

    console.log(chalk.bold("\nAvailable harnesses:\n"));

    for (const file of files) {
      try {
        const harness = loadHarness(file);
        const mode = harness.targets?.mode ?? inferMode(harness);
        const inferred = !harness.targets?.mode ? chalk.dim("*") : " ";
        const name = chalk.cyan(harness.name.padEnd(30));
        const version = chalk.gray(`v${harness.version}`);
        const modeLabel = MODE_LABELS[mode];
        const inspired = harness.inspired_by ? chalk.dim(` (${harness.inspired_by})`) : "";
        console.log(`  ${name} ${version}  ${modeLabel}${inferred}${inspired}`);
        const desc = harness.description.trim().split("\n")[0].slice(0, 75);
        console.log(chalk.dim(`    ${desc}`));
        console.log();
      } catch {
        const name = chalk.red(basename(file));
        console.log(`  ${name} ${chalk.red("(invalid)")}`);
      }
    }

    console.log(chalk.dim(`  * mode inferred from harness structure`));
    console.log(chalk.dim(`  Modes: ${chalk.blue("solo")} = Claude Code · ${chalk.yellow("team")} = OpenHarness · ${chalk.magenta("company")} = Paperclip+OH`));
  });

// ── harness validate ──────────────────────────────────────────────────────────

program
  .command("validate <file>")
  .description("Validate a harness YAML file against the schema")
  .action((file) => {
    try {
      const harness = loadHarness(file);
      const mode = harness.targets?.mode ?? inferMode(harness);
      const modeSource = harness.targets?.mode ? "" : chalk.dim(" (inferred)");

      console.log(chalk.green(`✓ ${harness.name} v${harness.version} is valid`));
      console.log(chalk.dim(`  Mode:        `) + MODE_LABELS[mode] + `  ${MODE_RUNTIME[mode]}` + modeSource);
      console.log(chalk.dim(`  Observation: ${harness.observation_space.length} tools, Action: ${harness.action_space.length} tools`));
      console.log(chalk.dim(`  Criteria:    ${harness.review_criteria.required.length} required, ${harness.review_criteria.conditional.length} conditional`));
      console.log(chalk.dim(`  HITL gates:  ${harness.hitl_gates.length}`));
      if (harness.grounding.length > 0) {
        console.log(chalk.dim(`  Grounding:   ${harness.grounding.length} rules`));
      }
      if (harness.handoffs.length > 0) {
        console.log(chalk.dim(`  Handoffs:    → ${harness.handoffs.map(h => h.to_role).join(", ")}`));
      }
      if (harness.loop) {
        console.log(chalk.dim(`  Loop:        ${harness.loop.style}, max ${harness.loop.max_iterations} iterations`));
      }
      if (harness.provider_hint) {
        console.log(chalk.dim(`  Provider:    ${harness.provider_hint.tier}`));
      }

      // Warn if explicit mode is lower than inferred
      if (harness.targets?.mode) {
        const inferred = inferMode(harness);
        const rank: Record<HarnessMode, number> = { solo: 0, team: 1, company: 2 };
        if (rank[harness.targets.mode] < rank[inferred]) {
          console.log(
            chalk.yellow(`\n  ⚠  targets.mode is "${harness.targets.mode}" but structure implies "${inferred}" — consider updating targets.mode`)
          );
        }
      }
    } catch (err) {
      console.error(chalk.red(`✗ Validation failed`));
      console.error(chalk.red(String(err)));
      process.exit(1);
    }
  });

// ── harness mode ──────────────────────────────────────────────────────────────

program
  .command("mode <file>")
  .description("Print the deployment mode for a harness (solo | team | company)")
  .action((file) => {
    try {
      const harness = loadHarness(file);
      const mode = harness.targets?.mode ?? inferMode(harness);
      const inferred = !harness.targets?.mode ? " (inferred)" : "";
      console.log(`${mode}${inferred}`);
      console.log(chalk.dim(`Runtime: ${MODE_RUNTIME[mode]}`));
    } catch (err) {
      console.error(chalk.red(`✗ ${err}`));
      process.exit(1);
    }
  });

// ── harness build ─────────────────────────────────────────────────────────────

program
  .command("build <file>")
  .description("Compile a harness YAML into a Claude Code skill (SKILL.md)")
  .option("-o, --output <dir>", "Output directory", DEFAULT_OUTPUT_DIR)
  .option("--dry-run", "Print the compiled output without writing to disk")
  .action((file, opts) => {
    let harness;
    try {
      harness = loadHarness(file);
    } catch (err) {
      console.error(chalk.red(`✗ Failed to load harness: ${err}`));
      process.exit(1);
    }

    const skill = compile(harness);
    const slash = compileSlashCommand(harness);

    if (opts.dryRun) {
      console.log(chalk.bold(`\n── SKILL.md ─────────────────────────────`));
      console.log(skill);
      console.log(chalk.bold(`\n── slash command ────────────────────────`));
      console.log(slash);
      return;
    }

    const outDir = join(opts.output, harness.name);
    const skillsDir = join(outDir, "skills");
    mkdirSync(skillsDir, { recursive: true });

    const skillPath = join(outDir, "SKILL.md");
    const slashPath = join(skillsDir, `${harness.name}.md`);

    writeFileSync(skillPath, skill, "utf8");
    writeFileSync(slashPath, slash, "utf8");

    const mode = harness.targets?.mode ?? inferMode(harness);
    console.log(chalk.green(`✓ Built ${harness.name} v${harness.version}`));
    console.log(chalk.dim(`  Mode:          ${mode}`));
    console.log(chalk.dim(`  Skill:         ${skillPath}`));
    console.log(chalk.dim(`  Slash command: ${slashPath}`));

    const lines = skill.split("\n").length;
    const words = skill.split(/\s+/).length;
    console.log(chalk.dim(`  Output: ${lines} lines, ~${words} tokens`));
  });

// ── harness build-all ─────────────────────────────────────────────────────────

program
  .command("build-all")
  .description("Compile all harnesses in the harnesses directory")
  .option("-d, --dir <path>", "Harness directory", DEFAULT_HARNESSES_DIR)
  .option("-o, --output <dir>", "Output directory", DEFAULT_OUTPUT_DIR)
  .action((opts) => {
    const files = listHarnesses(opts.dir);

    if (files.length === 0) {
      console.log(chalk.yellow(`No harnesses found in ${opts.dir}`));
      return;
    }

    console.log(chalk.bold(`\nBuilding ${files.length} harnesses...\n`));

    let success = 0;
    let failed = 0;

    for (const file of files) {
      try {
        const harness = loadHarness(file);
        const skill = compile(harness);
        const slash = compileSlashCommand(harness);
        const mode = harness.targets?.mode ?? inferMode(harness);

        const outDir = join(opts.output, harness.name);
        const skillsDir = join(outDir, "skills");
        mkdirSync(skillsDir, { recursive: true });

        writeFileSync(join(outDir, "SKILL.md"), skill, "utf8");
        writeFileSync(join(skillsDir, `${harness.name}.md`), slash, "utf8");

        const name = chalk.cyan(harness.name.padEnd(30));
        const modeLabel = MODE_LABELS[mode];
        const inspired = harness.inspired_by ? chalk.dim(`(${harness.inspired_by})`) : "";
        console.log(`  ${chalk.green("✓")} ${name} ${modeLabel} ${inspired}`);
        success++;
      } catch (err) {
        const name = chalk.red(basename(file).padEnd(30));
        console.log(`  ${chalk.red("✗")} ${name} ${chalk.red(String(err))}`);
        failed++;
      }
    }

    console.log();
    console.log(chalk.bold(
      `Done: ${chalk.green(`${success} built`)}, ${failed > 0 ? chalk.red(`${failed} failed`) : chalk.dim("0 failed")}`
    ));
    console.log(chalk.dim(`Output: ${opts.output}`));
  });

// ── harness preview ───────────────────────────────────────────────────────────

program
  .command("preview <file>")
  .description("Preview the compiled skill for a harness (dry-run build)")
  .action((file) => {
    let harness;
    try {
      harness = loadHarness(file);
    } catch (err) {
      console.error(chalk.red(`✗ ${err}`));
      process.exit(1);
    }

    const skill = compile(harness);
    console.log(chalk.bold(
      `\nPreview: ${harness.name} v${harness.version}` +
      (harness.inspired_by ? ` (${harness.inspired_by})` : "")
    ));
    console.log(chalk.dim("─".repeat(60)));
    console.log(skill);
  });

// ── harness deploy ────────────────────────────────────────────────────────────

program
  .command("deploy <file>")
  .description("Build and deploy a harness to a runtime target")
  .option(
    "-t, --target <target>",
    `Deploy target: ${Object.keys(DEPLOY_TARGETS).join(" | ")} (default: auto from mode)`
  )
  .action((file, opts) => {
    let harness;
    try {
      harness = loadHarness(file);
    } catch (err) {
      console.error(chalk.red(`✗ ${err}`));
      process.exit(1);
    }

    const mode = harness.targets?.mode ?? inferMode(harness);
    const target = (opts.target as string | undefined) ?? defaultTarget(mode);

    if (!DEPLOY_TARGETS[target]) {
      console.error(chalk.red(`✗ Unknown target "${target}". Choose: ${Object.keys(DEPLOY_TARGETS).join(", ")}`));
      process.exit(1);
    }

    const skill = compile(harness);
    const skillsDir = DEPLOY_TARGETS[target](harness.name);
    mkdirSync(skillsDir, { recursive: true });

    writeFileSync(join(skillsDir, `${harness.name}.md`), skill, "utf8");

    const targetLabel: Record<string, string> = {
      openharness: "OpenHarness (~/.openharness/skills/)",
      claude:      "Claude Code (~/.claude/skills/)",
      local:       "local compiled/",
    };

    const autoNote = !opts.target ? chalk.dim(` (auto from mode: ${mode})`) : "";
    console.log(chalk.green(`✓ Deployed ${harness.name} → ${targetLabel[target]}`) + autoNote);

    if (target === "openharness") {
      console.log(chalk.dim(`\n  Activate with: oh --skill ${harness.name}`));
    } else if (target === "claude") {
      console.log(chalk.dim(`\n  Activate with: /${harness.name} in Claude Code`));
    }
  });

// ── harness deploy-all ────────────────────────────────────────────────────────

program
  .command("deploy-all")
  .description("Build and deploy all harnesses to a runtime target")
  .option("-d, --dir <path>", "Harness directory", DEFAULT_HARNESSES_DIR)
  .option(
    "-t, --target <target>",
    `Deploy target: ${Object.keys(DEPLOY_TARGETS).join(" | ")} (default: auto from each harness mode)`
  )
  .action((opts) => {
    const files = listHarnesses(opts.dir);
    if (files.length === 0) {
      console.log(chalk.yellow("No harnesses found"));
      return;
    }

    const explicitTarget = opts.target as string | undefined;
    if (explicitTarget && !DEPLOY_TARGETS[explicitTarget]) {
      console.error(chalk.red(`✗ Unknown target "${explicitTarget}"`));
      process.exit(1);
    }

    const label = explicitTarget ?? "auto";
    console.log(chalk.bold(`\nDeploying ${files.length} harnesses → ${label}\n`));

    let success = 0;
    let failed = 0;

    for (const file of files) {
      try {
        const harness = loadHarness(file);
        const mode = harness.targets?.mode ?? inferMode(harness);
        const target = explicitTarget ?? defaultTarget(mode);

        const dest = DEPLOY_TARGETS[target](harness.name);
        mkdirSync(dest, { recursive: true });
        writeFileSync(join(dest, `${harness.name}.md`), compile(harness), "utf8");

        const modeLabel = explicitTarget ? "" : ` ${MODE_LABELS[mode]}`;
        console.log(`  ${chalk.green("✓")} ${chalk.cyan(harness.name)}${modeLabel} → ${target}`);
        success++;
      } catch (err) {
        console.log(`  ${chalk.red("✗")} ${chalk.red(basename(file))} — ${err}`);
        failed++;
      }
    }

    console.log(`\n${chalk.bold("Done:")} ${chalk.green(`${success} deployed`)}, ${
      failed > 0 ? chalk.red(`${failed} failed`) : chalk.dim("0 failed")
    }`);
  });

program.parse();
