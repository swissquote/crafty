#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

import resolveFrom from "resolve-from";
import tmp from "@swissquote/crafty-commons/packages/tmp.js";

import cli from "@swissquote/stylelint-config-swissquote/packages/stylelint-cli.js";

const require = createRequire(import.meta.url);

let configuration = {};
let idx;

// Read existing configuration if it exists
if ((idx = process.argv.indexOf("--config")) > -1) {
  configuration.extends = [];

  const configFile = process.argv[idx + 1];
  process.argv.splice(idx, 2);

  configuration = require(resolveFrom.silent(process.cwd(), configFile) ||
    path.join(process.cwd(), configFile));
}

if (!configuration.rules) {
  configuration.rules = {};
}

// Make sure extends is an array
if (!configuration.extends) {
  configuration.extends = [
    require.resolve("@swissquote/stylelint-config-swissquote/recommended")
  ];
} else if (typeof configuration.extends === "string") {
  configuration.extends = [configuration.extends];
}

// Add Swissquote configuration
if (process.argv.indexOf("--preset") > -1) {
  configuration.extends = [];

  while ((idx = process.argv.indexOf("--preset")) > -1) {
    configuration.extends.push(
      require.resolve(
        `@swissquote/stylelint-config-swissquote/${process.argv[idx + 1]}`
      )
    );
    process.argv.splice(idx, 2);
  }
}

const tmpfile = tmp.fileSync({ postfix: ".json" }).name;
fs.writeFileSync(tmpfile, JSON.stringify(configuration));

process.argv.push("--config");
process.argv.push(tmpfile);

// Define syntax if it isn't already defined
if (process.argv.indexOf("--custom-syntax") === -1) {
  process.argv.push("--custom-syntax");
  process.argv.push(require.resolve("postcss-scss"));
}

cli(process.argv.slice(2));
