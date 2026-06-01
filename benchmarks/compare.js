#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function fmt(bytes) {
  if (bytes === 0) return "–";
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function fmtTime(s) {
  return `${s.toFixed(2)}s`;
}

function fmtDelta(base, current) {
  if (base === undefined || base === null) return "";
  const pct = ((current - base) / base) * 100;
  const sign = pct >= 0 ? "+" : "";
  return ` (${sign}${pct.toFixed(1)}%)`;
}

function pad(str, len) {
  return String(str).padEnd(len);
}

function printBuildTable(permutations, baseMap) {
  const COL = {
    name: 28,
    time: 14,
    stddev: 10,
    js: 12,
    css: 10,
  };

  const header = [
    pad("Permutation", COL.name),
    pad("Build (mean)", COL.time),
    pad("Stddev", COL.stddev),
    pad("JS size", COL.js),
    pad("CSS size", COL.css),
  ].join(" | ");

  const sep = Object.values(COL)
    .map(n => "-".repeat(n))
    .join("-|-");

  console.log(header);
  console.log(sep);

  for (const p of permutations) {
    const base = baseMap[p.name];
    const timeDelta = base ? fmtDelta(base.build.mean_s, p.build.mean_s) : "";
    const jsDelta = base ? fmtDelta(base.bundle.js_bytes, p.bundle.js_bytes) : "";
    const cssDelta = base ? fmtDelta(base.bundle.css_bytes, p.bundle.css_bytes) : "";

    const row = [
      pad(p.name, COL.name),
      pad(
        `${fmtTime(p.build.mean_s)}${timeDelta}`,
        COL.time + (timeDelta ? timeDelta.length : 0)
      ),
      pad(`±${fmtTime(p.build.stddev_s)}`, COL.stddev),
      pad(
        `${fmt(p.bundle.js_bytes)}${jsDelta}`,
        COL.js + (jsDelta ? jsDelta.length : 0)
      ),
      pad(
        `${fmt(p.bundle.css_bytes)}${cssDelta}`,
        COL.css + (cssDelta ? cssDelta.length : 0)
      ),
    ].join(" | ");

    console.log(row);
  }
}

function printTestTable(permutations, baseMap) {
  const COL = {
    name: 28,
    time: 14,
    stddev: 10,
  };

  const header = [
    pad("Permutation", COL.name),
    pad("Run (mean)", COL.time),
    pad("Stddev", COL.stddev),
  ].join(" | ");

  const sep = Object.values(COL)
    .map(n => "-".repeat(n))
    .join("-|-");

  console.log(header);
  console.log(sep);

  for (const p of permutations) {
    const base = baseMap[p.name];
    const timeDelta = base ? fmtDelta(base.build.mean_s, p.build.mean_s) : "";

    const row = [
      pad(p.name, COL.name),
      pad(
        `${fmtTime(p.build.mean_s)}${timeDelta}`,
        COL.time + (timeDelta ? timeDelta.length : 0)
      ),
      pad(`±${fmtTime(p.build.stddev_s)}`, COL.stddev),
    ].join(" | ");

    console.log(row);
  }
}

function printTable(current, baseline) {
  const baseMap = baseline
    ? Object.fromEntries(baseline.permutations.map(p => [p.name, p]))
    : {};

  const buildPerms = current.permutations.filter(
    p => (p.domain ?? "build") === "build"
  );
  const testPerms = current.permutations.filter(
    p => (p.domain ?? "build") === "test"
  );

  if (buildPerms.length > 0) {
    console.log("\n── Build permutations " + "─".repeat(55));
    printBuildTable(buildPerms, baseMap);
  }

  if (testPerms.length > 0) {
    console.log("\n── Test permutations " + "─".repeat(56));
    printTestTable(testPerms, baseMap);
  }

  console.log();
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    const resultsDir = path.join(__dirname, "results");
    const files = fs
      .readdirSync(resultsDir)
      .filter(f => f.endsWith(".json"))
      .sort()
      .reverse();

    if (files.length === 0) {
      console.error("No result files found in benchmarks/results/");
      process.exit(1);
    }

    const current = JSON.parse(
      fs.readFileSync(path.join(resultsDir, files[0]), "utf8")
    );
    const baseline =
      files.length > 1
        ? JSON.parse(fs.readFileSync(path.join(resultsDir, files[1]), "utf8"))
        : null;

    console.log(`Current: ${current.timestamp}`);
    if (baseline) console.log(`Baseline: ${baseline.timestamp}`);
    printTable(current, baseline);
    return;
  }

  const [currentFile, baselineFile] = args;
  const current = JSON.parse(fs.readFileSync(currentFile, "utf8"));
  const baseline = baselineFile
    ? JSON.parse(fs.readFileSync(baselineFile, "utf8"))
    : null;

  console.log(`Current: ${current.timestamp}`);
  if (baseline) console.log(`Baseline: ${baseline.timestamp}`);
  printTable(current, baseline);
}

module.exports = { printTable };

if (require.main === module) {
  main();
}
