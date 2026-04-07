#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { mkdirSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { homedir } from "os";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";
import { loadHarness, listHarnesses } from "./loader.js";
import { compile, compileSlashCommand } from "./compiler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_HARNESSES_DIR = join(__dirname, "../harnesses");
const DEFAULT_OUTPUT_DIR = join(__dirname, "../compiled");

const program = new Command();

program
  .name("harness")
  .description("Harness-as-Code CLI — define agent action spaces, compile to Claude Code skills")
  .version("0.1.0");

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
        const name = chalk.cyan(harness.name.padEnd(30));
        const version = chalk.gray(`v${harness.version}`);
        const inspired = harness.inspired_by
          ? chalk.dim(` (${harness.inspired_by})`)
          : "";
        console.log(`  ${name} ${version}${inspired}`);
        const desc = harness.description.trim().split("\n")[0].slice(0, 80);
        console.log(chalk.dim(`    ${desc}`));
        console.log();
      } catch {
        const name = chalk.red(basename(file));
        console.log(`  ${name} ${chalk.red("(invalid)")}`);
      }
    }
  });

// ── harness validate ──────────────────────────────────────────────────────────

program
  .command("validate <file>")
  .description("Validate a harness YAML file against the schema")
  .action((file) => {
    try {
      const harness = loadHarness(file);
      console.log(chalk.green(`✓ ${harness.name} v${harness.version} is valid`));

      // Summary
      console.log(chalk.dim(`  Tools: ${harness.action_space.tools.length}`));
      console.log(
        chalk.dim(
          `  Criteria: ${harness.review_criteria.required.length} required, ` +
          `${harness.review_criteria.conditional.length} conditional`
        )
      );
      console.log(
        chalk.dim(
          `  HITL gates: ${harness.hitl_gates.length}`
        )
      );
      console.log(
        chalk.dim(
          `  Special focus areas: ${harness.special_focus.length}`
        )
      );
    } catch (err) {
      console.error(chalk.red(`✗ Validation failed`));
      console.error(chalk.red(String(err)));
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

    // Write to output dir
    const outDir = join(opts.output, harness.name);
    const skillsDir = join(outDir, "skills");
    mkdirSync(skillsDir, { recursive: true });

    const skillPath = join(outDir, "SKILL.md");
    const slashPath = join(skillsDir, `${harness.name}.md`);

    writeFileSync(skillPath, skill, "utf8");
    writeFileSync(slashPath, slash, "utf8");

    console.log(chalk.green(`✓ Built ${harness.name} v${harness.version}`));
    console.log(chalk.dim(`  Skill:         ${skillPath}`));
    console.log(chalk.dim(`  Slash command: ${slashPath}`));

    // Stats
    const lines = skill.split("\n").length;
    const words = skill.split(/\s+/).length;
    console.log(
      chalk.dim(`  Output: ${lines} lines, ~${words} tokens`)
    );
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

        const outDir = join(opts.output, harness.name);
        const skillsDir = join(outDir, "skills");
        mkdirSync(skillsDir, { recursive: true });

        writeFileSync(join(outDir, "SKILL.md"), skill, "utf8");
        writeFileSync(
          join(skillsDir, `${harness.name}.md`),
          slash,
          "utf8"
        );

        const name = chalk.cyan(harness.name.padEnd(30));
        const inspired = harness.inspired_by
          ? chalk.dim(`(${harness.inspired_by})`)
          : "";
        console.log(`  ${chalk.green("✓")} ${name} ${inspired}`);
        success++;
      } catch (err) {
        const name = chalk.red(basename(file).padEnd(30));
        console.log(`  ${chalk.red("✗")} ${name} ${chalk.red(String(err))}`);
        failed++;
      }
    }

    console.log();
    console.log(
      chalk.bold(
        `Done: ${chalk.green(`${success} built`)}, ${failed > 0 ? chalk.red(`${failed} failed`) : chalk.dim("0 failed")}`
      )
    );
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

    console.log(
      chalk.bold(
        `\nPreview: ${harness.name} v${harness.version}` +
        (harness.inspired_by ? ` (${harness.inspired_by})` : "")
      )
    );
    console.log(chalk.dim("─".repeat(60)));
    console.log(skill);
  });

// ── harness deploy ────────────────────────────────────────────────────────────

const DEPLOY_TARGETS: Record<string, (name: string) => string> = {
  openharness: () => join(homedir(), ".openharness", "skills"),
  claude:      () => join(homedir(), ".claude", "skills"),
  local:       (name) => join(DEFAULT_OUTPUT_DIR, name),
};

program
  .command("deploy <file>")
  .description("Build and deploy a harness to a runtime target")
  .option(
    "-t, --target <target>",
    `Deploy target: ${Object.keys(DEPLOY_TARGETS).join(" | ")}`,
    "openharness"
  )
  .action((file, opts) => {
    const target = opts.target as string;
    if (!DEPLOY_TARGETS[target]) {
      console.error(
        chalk.red(`✗ Unknown target "${target}". Choose: ${Object.keys(DEPLOY_TARGETS).join(", ")}`)
      );
      process.exit(1);
    }

    let harness;
    try {
      harness = loadHarness(file);
    } catch (err) {
      console.error(chalk.red(`✗ ${err}`));
      process.exit(1);
    }

    const skill = compile(harness);
    const skillsDir = DEPLOY_TARGETS[target](harness.name);
    mkdirSync(skillsDir, { recursive: true });

    const skillPath = join(skillsDir, `${harness.name}.md`);
    writeFileSync(skillPath, skill, "utf8");

    const targetLabel: Record<string, string> = {
      openharness: "OpenHarness (~/.openharness/skills/)",
      claude:      "Claude Code (~/.claude/skills/)",
      local:       "local compiled/",
    };

    console.log(
      chalk.green(`✓ Deployed ${harness.name} → ${targetLabel[target]}`)
    );
    console.log(chalk.dim(`  Path: ${skillPath}`));

    if (target === "openharness") {
      console.log(
        chalk.dim(`\n  Activate with: oh --skill ${harness.name}`)
      );
    } else if (target === "claude") {
      console.log(
        chalk.dim(`\n  Activate with: /${harness.name} in Claude Code`)
      );
    }
  });

// ── harness deploy-all ────────────────────────────────────────────────────────

program
  .command("deploy-all")
  .description("Build and deploy all harnesses to a runtime target")
  .option("-d, --dir <path>", "Harness directory", DEFAULT_HARNESSES_DIR)
  .option(
    "-t, --target <target>",
    `Deploy target: ${Object.keys(DEPLOY_TARGETS).join(" | ")}`,
    "openharness"
  )
  .action((opts) => {
    const target = opts.target as string;
    if (!DEPLOY_TARGETS[target]) {
      console.error(chalk.red(`✗ Unknown target "${target}"`));
      process.exit(1);
    }

    const files = listHarnesses(opts.dir);
    if (files.length === 0) {
      console.log(chalk.yellow("No harnesses found"));
      return;
    }

    const skillsDir = DEPLOY_TARGETS[target]("");
    mkdirSync(skillsDir, { recursive: true });

    console.log(chalk.bold(`\nDeploying ${files.length} harnesses → ${target}\n`));

    let success = 0;
    let failed = 0;

    for (const file of files) {
      try {
        const harness = loadHarness(file);
        const skill = compile(harness);
        const dest = DEPLOY_TARGETS[target](harness.name);
        mkdirSync(dest, { recursive: true });
        writeFileSync(join(dest, `${harness.name}.md`), skill, "utf8");
        console.log(`  ${chalk.green("✓")} ${chalk.cyan(harness.name)}`);
        success++;
      } catch (err) {
        console.log(`  ${chalk.red("✗")} ${chalk.red(basename(file))} — ${err}`);
        failed++;
      }
    }

    console.log(
      `\n${chalk.bold("Done:")} ${chalk.green(`${success} deployed`)}, ${
        failed > 0 ? chalk.red(`${failed} failed`) : chalk.dim("0 failed")
      }`
    );
  });

program.parse();
