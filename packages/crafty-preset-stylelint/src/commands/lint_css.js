#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const resolveFrom = require("resolve-from");
const tmp = require("@swissquote/crafty-commons/packages/tmp");

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

require("../../packages/stylelint-bin");
