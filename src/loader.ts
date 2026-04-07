import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import { HarnessSchema, type Harness } from "./schema.js";

export function loadHarness(filePath: string): Harness {
  const raw = readFileSync(filePath, "utf8");
  const parsed = yaml.load(raw);
  const result = HarnessSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid harness at ${filePath}:\n${issues}`);
  }
  return result.data;
}

export function listHarnesses(dir: string): string[] {
  const results: string[] = [];
  function walk(current: string) {
    try {
      for (const entry of readdirSync(current, { withFileTypes: true })) {
        const full = join(current, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.name.endsWith(".yaml") || entry.name.endsWith(".yml")) {
          results.push(full);
        }
      }
    } catch {
      // skip unreadable dirs
    }
  }
  walk(dir);
  return results;
}
