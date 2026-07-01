#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  resolveOxfmtBin,
  hasPositionalPath,
  withDefaultIgnorePath
} from "../utils.js";

/**
 * Run oxfmt, forwarding all CLI arguments.
 *
 * oxfmt defaults to `--write` (format in place); pass `--check` for CI.
 * We add a couple of Crafty conveniences:
 *  - reuse an existing `.prettierignore` as `--ignore-path`
 *  - default to formatting the current directory when no path is given
 *
 * This deliberately spawns the oxfmt CLI (rather than using oxfmt's `format()`
 * JS API) so the standalone command keeps the binary's globbing, ignore-file
 * handling and `--write`/`--check` behavior for free.
 */
export default function runOxfmt() {
  const argv = process.argv.slice(2);

  // Drop the Crafty sub-command token ("oxfmt") when invoked as `crafty oxfmt`
  if (argv[0] === "oxfmt") {
    argv.shift();
  }

  let args = withDefaultIgnorePath(argv);

  if (!hasPositionalPath(argv)) {
    args = [...args, "."];
  }

  const result = spawnSync(process.execPath, [resolveOxfmtBin(), ...args], {
    stdio: "inherit"
  });

  process.exit(result.status ?? 1);
}

// Allow using this file directly as a CLI tool
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runOxfmt();
}
