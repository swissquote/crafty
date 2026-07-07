#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { toTempConfigFile } from "../templates.js";
import { resolveOxlintBin } from "../utils.js";

/**
 * Extract the Crafty-specific arguments that oxlint wouldn't understand.
 *  - `--preset <flavor>` (repeatable) selects the Swissquote flavor(s)
 *  - `--config <file>` merges an external oxlint config
 */
function extractConfig(args) {
  const presets = [];
  let configFile;
  let idx;

  while ((idx = args.indexOf("--preset")) > -1) {
    presets.push(args[idx + 1]);
    args.splice(idx, 2);
  }

  if ((idx = args.indexOf("--config")) > -1) {
    configFile = args[idx + 1];
    args.splice(idx, 2);
  }

  return { presets, configFile };
}

/**
 * SARIF report path, hashed on the arguments so parallel runs don't clash
 * (mirrors the convention of crafty-preset-eslint's formatter).
 */
function getReportFilePath(args) {
  const dir = path.join(process.cwd(), "reports", "oxlint");
  fs.mkdirSync(dir, { recursive: true });
  const hash = crypto
    .createHash("md5")
    .update(args.join("|"))
    .digest("hex")
    .slice(0, 8);
  return path.join(dir, `oxlint_${hash}.sarif.json`);
}

export default function runOxlint(crafty) {
  const argv = process.argv.slice(2);

  // Drop the Crafty sub-command token when invoked as `crafty oxlint`
  if (argv[0] === "oxlint") {
    argv.shift();
  }

  const extracted = extractConfig(argv);
  const configPath = toTempConfigFile(crafty, extracted);
  const oxlintBin = resolveOxlintBin();
  const baseArgs = ["--config", configPath, ...argv];

  // 1. Human-readable run: streamed to the console, drives the exit code
  const consoleRun = spawnSync(process.execPath, [oxlintBin, ...baseArgs], {
    stdio: "inherit"
  });

  // 2. SARIF run: oxlint has no `--output-file` yet, so we capture the SARIF
  //    output and write it to reports/oxlint/ for tooling.
  const sarifRun = spawnSync(
    process.execPath,
    [oxlintBin, "--format", "sarif", ...baseArgs],
    { encoding: "utf-8" }
  );
  if (sarifRun.stdout) {
    fs.writeFileSync(getReportFilePath(argv), sarifRun.stdout);
  }

  process.exit(consoleRun.status ?? 1);
}

// Allow using this file directly as a CLI tool
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  import("@swissquote/crafty")
    .then(async ({ initialize }) => {
      const crafty = await initialize([], {
        readConfig: false,
        presets: ["@swissquote/crafty-preset-oxlint"]
      });

      runOxlint(crafty);
    })
    .catch(error => {
      console.error(error.message || error);
      process.exit(1);
    });
}
