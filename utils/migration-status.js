#!/usr/bin/env node

// Generates the status table of MIGRATION_ESM.md from the build.config.js files.
// Usage: node utils/migration-status.js

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { Builder } from "./builder.js";

const root = path.dirname(import.meta.dirname);
const documentFile = path.join(root, "MIGRATION_ESM.md");
const START = "<!-- status:start -->";
const END = "<!-- status:end -->";

// Records what a bundle would be built with, without building it
class RecordingBuilder extends Builder {
  async build() {
    return this.values;
  }
}

function findPackages() {
  return ["packages", "package-forks"]
    .flatMap(dir =>
      fs
        .readdirSync(path.join(root, dir), { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(dir, entry.name))
    )
    .filter(dir => fs.existsSync(path.join(root, dir, "build.config.js")))
    .sort();
}

async function getBundles(dir) {
  // build.config.js files resolve externals from the current directory
  process.chdir(path.join(root, dir));

  const configUrl = pathToFileURL(path.join(root, dir, "build.config.js"));

  // Some build.config.js files log while they are loaded, keep the output readable
  const log = console.log;
  console.log = () => {};
  let configuration;
  try {
    ({ default: configuration } = await import(configUrl.href));
  } finally {
    console.log = log;
  }

  const bundles = [];
  for (const entry of configuration) {
    // Entries taking only a builder declare a bundle; the others are
    // post-processing steps with side effects, so they are not called.
    if (entry.length !== 1) {
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const values = await entry(name => new RecordingBuilder(name));
    bundles.push({
      name: values.name,
      compiler: values.options.esm ? "rslib" : "ncc"
    });
  }

  return bundles;
}

function formatList(bundles) {
  return bundles.map(bundle => `\`${bundle.name}\``).join(", ") || "–";
}

async function generateTable() {
  const rows = [
    "| Package | Type | Bundles on ncc | rslib bundles |",
    "|---|---|---|---|"
  ];

  for (const dir of findPackages()) {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(root, dir, "package.json"), "utf-8")
    );
    // eslint-disable-next-line no-await-in-loop
    const bundles = await getBundles(dir);
    const ncc = bundles.filter(bundle => bundle.compiler === "ncc");
    const rslib = bundles.filter(bundle => bundle.compiler === "rslib");

    rows.push(
      `| ${pkg.name} | ${pkg.type === "module" ? "ESM" : "CJS"} | ${formatList(
        ncc
      )} | ${rslib.length} |`
    );
  }

  return rows.join("\n");
}

const table = await generateTable();
const document = fs.readFileSync(documentFile, "utf-8");
const start = document.indexOf(START);
const end = document.indexOf(END);

if (start === -1 || end === -1) {
  throw new Error(`Could not find ${START} and ${END} in ${documentFile}`);
}

fs.writeFileSync(
  documentFile,
  `${document.slice(0, start + START.length)}\n${table}\n${document.slice(end)}`
);
console.log(`Updated ${path.relative(root, documentFile)}`);
