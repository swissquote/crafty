#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// --- Helpers ---

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1000;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const decimals = i === 0 ? 0 : 1;

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${
    sizes[i]
  }`;
}

function computePct(delta, baseline) {
  if (baseline === 0) {
    return delta === 0 ? 0 : 100;
  }
  return (delta / baseline) * 100;
}

function formatDelta(current, baseline) {
  if (baseline == null || current == null) return "N/A";

  const delta = current - baseline;
  const pct = computePct(delta, baseline);
  const sign = delta > 0 ? "+" : "";

  return `${sign}${formatBytes(delta)} (${sign}${pct.toFixed(1)}%)`;
}

function classifyDelta(current, baseline) {
  if (baseline == null || current == null) {
    return { emoji: "", label: "no-baseline" };
  }

  const delta = current - baseline;
  if (delta === 0) return { emoji: "", label: "unchanged" };

  const pct = computePct(delta, baseline);

  if (pct < 0) return { emoji: ":arrow_down_small:", label: "decrease" };
  if (pct <= 5)
    return { emoji: ":small_orange_diamond:", label: "small-increase" };
  return { emoji: ":red_circle:", label: "large-increase" };
}

function parseNDJSON(str) {
  return str
    .split("\n")
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}

function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      result[key] = args[i + 1] || true;
      i++;
    }
  }
  return result;
}

function getCommitSha() {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return process.env.GITHUB_SHA?.substring(0, 7) || "unknown";
  }
}

function tryReadJSON(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    console.error(`Warning: failed to parse baseline file: ${e.message}`);
    return null;
  }
}

function pluralize(count, singular) {
  return count === 1 ? `${count} ${singular}` : `${count} ${singular}s`;
}

// --- measure command ---

function measure(args) {
  const opts = parseArgs(args);
  const outputPath = opts.output || "pkg-sizes.json";
  const rootDir = process.cwd();

  const workspacesRaw = execSync("yarn workspaces list --no-private --json", {
    encoding: "utf-8",
    cwd: rootDir
  });
  const packages = parseNDJSON(workspacesRaw).filter(ws => ws.location !== ".");

  const result = {
    generated: new Date().toISOString(),
    commit: getCommitSha(),
    packages: {}
  };

  let totalTarball = 0;
  let totalUnpacked = 0;
  let errorCount = 0;

  for (const ws of packages) {
    const pkgDir = path.resolve(rootDir, ws.location);

    try {
      const packOutput = execSync("npm pack --dry-run --json", {
        cwd: pkgDir,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"]
      });

      const parsed = JSON.parse(packOutput);
      const entry = Array.isArray(parsed) ? parsed[0] : parsed;

      result.packages[ws.name] = {
        tarballSize: entry.size,
        unpackedSize: entry.unpackedSize,
        fileCount: entry.files ? entry.files.length : 0
      };

      totalTarball += entry.size;
      totalUnpacked += entry.unpackedSize;
    } catch (e) {
      console.error(`Warning: failed to measure ${ws.name}: ${e.message}`);
      result.packages[ws.name] = {
        tarballSize: null,
        unpackedSize: null,
        fileCount: null,
        error: true
      };
      errorCount++;
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  const measured = packages.length - errorCount;
  console.log(
    `Measured ${measured}/${
      packages.length
    } packages (total tarball: ${formatBytes(
      totalTarball
    )}, unpacked: ${formatBytes(totalUnpacked)})`
  );

  if (errorCount > 0) {
    console.error(`${errorCount} package(s) failed to measure`);
  }
}

// --- report helpers ---

function classifyEntry(entry, hasBaseline) {
  const { current: cur, baseline: base } = entry;

  if (cur?.error) return "error";
  if (!hasBaseline) return "no-baseline";
  if (!base && cur) return "added";
  if (base && !cur) return "removed";
  if (
    cur.tarballSize === base.tarballSize &&
    cur.unpackedSize === base.unpackedSize
  ) {
    return "unchanged";
  }
  return "changed";
}

function formatChangedRow(entry) {
  const { name, current: cur, baseline: base, status } = entry;

  switch (status) {
    case "added":
      return `| ${name} | ${formatBytes(cur.tarballSize)} | ${formatBytes(
        cur.unpackedSize
      )} | *new* | *new* | :sparkles: |`;
    case "removed":
      return `| ${name} | - | - | -${formatBytes(
        base.tarballSize
      )} | -${formatBytes(base.unpackedSize)} | :x: |`;
    case "error":
      return `| ${name} | :warning: error | :warning: error | N/A | N/A | :warning: |`;
    default: {
      const classification = classifyDelta(cur.tarballSize, base.tarballSize);
      return `| ${name} | ${formatBytes(cur.tarballSize)} | ${formatBytes(
        cur.unpackedSize
      )} | ${formatDelta(cur.tarballSize, base.tarballSize)} | ${formatDelta(
        cur.unpackedSize,
        base.unpackedSize
      )} | ${classification.emoji} |`;
    }
  }
}

function buildSummarySection(baseline, totals) {
  const lines = [];
  const totalLine = `**Total**: ${formatBytes(
    totals.currentTarball
  )} tarball, ${formatBytes(totals.currentUnpacked)} unpacked`;

  if (!baseline) {
    lines.push(
      totalLine,
      "*No baseline available \u2014 deltas will appear after the base branch is built.*"
    );
    return lines;
  }

  lines.push(totalLine);

  const tarballDelta = totals.currentTarball - totals.baselineTarball;
  const unpackedDelta = totals.currentUnpacked - totals.baselineUnpacked;

  if (tarballDelta === 0 && unpackedDelta === 0) {
    lines.push("**Delta**: no change");
  } else {
    const tarballSign = tarballDelta > 0 ? "+" : "";
    const unpackedSign = unpackedDelta > 0 ? "+" : "";
    lines.push(
      `**Delta**: ${tarballSign}${formatBytes(
        tarballDelta
      )} tarball, ${unpackedSign}${formatBytes(unpackedDelta)} unpacked`
    );
  }

  return lines;
}

function buildChangedTable(changed) {
  if (changed.length === 0) return [];

  return [
    "| Package | Tarball | Unpacked | Tarball \u0394 | Unpacked \u0394 | |",
    "|---------|--------:|---------:|----------:|-----------:|:-:|",
    ...changed.map(formatChangedRow),
    ""
  ];
}

function buildUnchangedSection(unchanged, hasBaseline) {
  if (unchanged.length === 0) return [];

  const label = hasBaseline
    ? pluralize(unchanged.length, "unchanged package")
    : pluralize(unchanged.length, "package");

  const rows = unchanged
    .filter(entry => entry.current && !entry.current.error)
    .map(
      entry =>
        `| ${entry.name} | ${formatBytes(
          entry.current.tarballSize
        )} | ${formatBytes(entry.current.unpackedSize)} |`
    );

  return [
    "<details>",
    `<summary>${label}</summary>`,
    "",
    "| Package | Tarball | Unpacked |",
    "|---------|--------:|---------:|",
    ...rows,
    "",
    "</details>",
    ""
  ];
}

function buildStatusSummary(baseline, totals) {
  if (!baseline) {
    return `Total: ${formatBytes(totals.currentTarball)} (no baseline)`;
  }

  const tarballDelta = totals.currentTarball - totals.baselineTarball;
  if (tarballDelta === 0) {
    return `Total: ${formatBytes(totals.currentTarball)} (no change)`;
  }

  const sign = tarballDelta > 0 ? "+" : "";
  const pct =
    totals.baselineTarball === 0
      ? 0
      : (tarballDelta / totals.baselineTarball) * 100;
  return `Total: ${formatBytes(totals.currentTarball)} (${sign}${formatBytes(
    tarballDelta
  )}, ${sign}${pct.toFixed(1)}%)`;
}

// --- report command ---

function report(args) {
  const opts = parseArgs(args);
  const currentPath = opts.current;
  const mdPath = opts["output-md"] || "pkg-sizes-report.md";
  const summaryPath = opts["output-summary"] || "pkg-sizes-summary.txt";

  if (!currentPath) {
    console.error("Error: --current is required");
    process.exit(1);
  }

  const current = JSON.parse(fs.readFileSync(currentPath, "utf-8"));
  const baseline = tryReadJSON(opts.baseline);

  // Build unified package list
  const allNames = new Set([
    ...Object.keys(current.packages),
    ...(baseline ? Object.keys(baseline.packages) : [])
  ]);
  const sortedNames = [...allNames].sort((a, b) => a.localeCompare(b));

  const changed = [];
  const unchanged = [];
  const totals = {
    currentTarball: 0,
    currentUnpacked: 0,
    baselineTarball: 0,
    baselineUnpacked: 0
  };

  for (const name of sortedNames) {
    const cur = current.packages[name] || null;
    const base = baseline?.packages[name] || null;

    if (cur && !cur.error) {
      totals.currentTarball += cur.tarballSize;
      totals.currentUnpacked += cur.unpackedSize;
    }
    if (base && !base.error) {
      totals.baselineTarball += base.tarballSize;
      totals.baselineUnpacked += base.unpackedSize;
    }

    const entry = { name, current: cur, baseline: base };
    entry.status = classifyEntry(entry, Boolean(baseline));

    if (entry.status === "unchanged" || entry.status === "no-baseline") {
      unchanged.push(entry);
    } else {
      changed.push(entry);
    }
  }

  // Assemble markdown
  const lines = [
    "## Package Size Report",
    "",
    ...buildSummarySection(baseline, totals),
    "",
    ...buildChangedTable(changed),
    ...(changed.length === 0 && baseline
      ? ["No size changes detected.", ""]
      : []),
    ...buildUnchangedSection(unchanged, Boolean(baseline)),
    ...(baseline ? [`*Compared against \`${baseline.commit}\`*`] : [])
  ];

  const markdown = lines.join("\n");
  fs.writeFileSync(mdPath, markdown);

  const summary = buildStatusSummary(baseline, totals);
  fs.writeFileSync(summaryPath, summary);

  console.log(`Report: ${mdPath}`);
  console.log(`Summary: ${summary}`);
}

// --- Main ---

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "measure":
    measure(args);
    break;
  case "report":
    report(args);
    break;
  default:
    console.error("Usage: package-sizes.mjs <measure|report> [options]");
    console.error("  measure --output <path>      Measure package sizes");
    console.error(
      "  report --current <path> --baseline <path> --output-md <path> --output-summary <path>"
    );
    process.exit(1);
}
