#!/usr/bin/env node

import fs from "node:fs";

import { Builder } from "./builder.js";
import { findFiles, scanFiles, printReport } from "./duplicates.js";
import * as compileUtils from "./compile.mjs";

function builder(name) {
  return new Builder(name);
}

async function main() {
  // Start with a cleanup
  fs.rmSync(`${process.cwd()}/dist`, { force: true, recursive: true });

  const toBuild = await import(`${process.cwd()}/build.config.js`);
  const configuration = toBuild.default;

  for (const bundle of configuration) {
    // eslint-disable-next-line no-await-in-loop
    await bundle(builder, compileUtils);
  }

  const statFiles = findFiles();
  if (statFiles.length > 0) {
    const report = scanFiles(statFiles);

    const duplicateModules = report.duplicateModules.filter(
      toBuild.keepDuplicateFile || Boolean
    );
    const duplicateModulesByPackage = report.duplicateModulesByPackage.filter(
      toBuild.keepDuplicateModule || Boolean
    );

    if (duplicateModules.length > 0) {
      console.error("Found duplicate packages");
      printReport(duplicateModules, duplicateModulesByPackage);

      process.exit(1);
    }
  }
}

main().then(
  () => {
    console.log("Success");
  },
  e => {
    console.error("Failed", e);
    process.exit(1);
  }
);
