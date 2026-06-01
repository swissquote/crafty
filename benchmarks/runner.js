#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const BENCH_DIR = __dirname;
const DIST_DIR = path.join(BENCH_DIR, "dist");
const RESULTS_DIR = path.join(BENCH_DIR, "results");
const CRAFTY_CONFIG = path.join(BENCH_DIR, "crafty.config.js");
const CRAFTY_BIN = path.join(BENCH_DIR, "..", "node_modules", ".bin", "crafty");

const WARMUP_RUNS = 1;
const BENCH_RUNS = 5;

function findPermutations() {
  const all = fs
    .readdirSync(BENCH_DIR)
    .filter(f => /^crafty\.config\..+\.js$/.test(f))
    .map(f => f.replace(/^crafty\.config\./, "").replace(/\.js$/, ""))
    .sort();

  const filter = process.env.BENCH_PERMUTATIONS;
  if (!filter) return all;

  const requested = filter
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  return all.filter(name => requested.includes(name));
}

/**
 * Determines which benchmark domain a config file belongs to.
 * Configs that declare crafty-preset-jest or crafty-preset-vitest are "test"
 * domain; everything else is "build" domain.
 */
function getConfigDomain(configPath) {
  // Load the config file fresh each time (bypass the require cache)
  delete require.cache[require.resolve(configPath)];
  const cfg = require(configPath);
  const presets = cfg.presets || [];
  return presets.some(p => /crafty-preset-(jest|vitest)/.test(p))
    ? "test"
    : "build";
}

function measureBundleSize() {
  const sizes = { js_bytes: 0, css_bytes: 0 };
  if (!fs.existsSync(DIST_DIR)) return sizes;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const size = fs.statSync(full).size;
        if (entry.name.endsWith(".js")) sizes.js_bytes += size;
        else if (entry.name.endsWith(".css")) sizes.css_bytes += size;
      }
    }
  }

  walk(DIST_DIR);
  return sizes;
}

function runBuildDomain(name) {
  const cmd = [
    "hyperfine",
    `--warmup ${WARMUP_RUNS}`,
    `--runs ${BENCH_RUNS}`,
    `--prepare 'rm -rf "${DIST_DIR}"'`,
    `--export-json /tmp/hyperfine-${name}.json`,
    "--show-output",
    `'${CRAFTY_BIN} run'`,
  ].join(" ");

  const result = spawnSync(cmd, {
    cwd: BENCH_DIR,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(`hyperfine failed for ${name}`);
    process.exitCode = 1;
    return null;
  }

  const hyperfineOutput = JSON.parse(
    fs.readFileSync(`/tmp/hyperfine-${name}.json`, "utf8")
  );
  const stats = hyperfineOutput.results[0];
  const bundle = measureBundleSize();

  return {
    name,
    domain: "build",
    build: {
      mean_s: stats.mean,
      stddev_s: stats.stddev,
      min_s: stats.min,
      max_s: stats.max,
    },
    bundle,
  };
}

function runTestDomain(name) {
  const cmd = [
    "hyperfine",
    `--warmup ${WARMUP_RUNS}`,
    `--runs ${BENCH_RUNS}`,
    `--export-json /tmp/hyperfine-${name}.json`,
    "--show-output",
    `'${CRAFTY_BIN} test'`,
  ].join(" ");

  const result = spawnSync(cmd, {
    cwd: BENCH_DIR,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.error(`hyperfine failed for ${name}`);
    process.exitCode = 1;
    return null;
  }

  const hyperfineOutput = JSON.parse(
    fs.readFileSync(`/tmp/hyperfine-${name}.json`, "utf8")
  );
  const stats = hyperfineOutput.results[0];

  return {
    name,
    domain: "test",
    build: {
      mean_s: stats.mean,
      stddev_s: stats.stddev,
      min_s: stats.min,
      max_s: stats.max,
    },
  };
}

function runPermutation(name) {
  const configSrc = path.join(BENCH_DIR, `crafty.config.${name}.js`);
  const domain = getConfigDomain(configSrc);

  console.log(`\n── ${name} (${domain}) ──`);

  fs.copyFileSync(configSrc, CRAFTY_CONFIG);

  return domain === "test" ? runTestDomain(name) : runBuildDomain(name);
}

function cleanup() {
  if (fs.existsSync(CRAFTY_CONFIG)) {
    fs.unlinkSync(CRAFTY_CONFIG);
  }
}

function main() {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }

  const permutations = findPermutations();
  if (permutations.length === 0) {
    console.error("No crafty.config.<name>.js files found in benchmarks/");
    process.exit(1);
  }

  console.log(`Running benchmarks for: ${permutations.join(", ")}`);

  const results = [];
  try {
    for (const name of permutations) {
      const result = runPermutation(name);
      if (result) results.push(result);
    }
  } finally {
    cleanup();
  }

  const timestamp = new Date().toISOString();
  const output = { timestamp, permutations: results };

  const dateSlug = timestamp
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);
  const outFile = path.join(RESULTS_DIR, `${dateSlug}.json`);
  fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
  console.log(`\nResults saved to ${outFile}`);

  require("./compare.js").printTable(output);
}

main();
