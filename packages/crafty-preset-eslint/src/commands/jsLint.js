#!/usr/bin/env node

// Force flat config mode
process.env.ESLINT_USE_FLAT_CONFIG = "true";

const { toTempFile, jsLintConfiguration } = require("../eslintConfigurator.js");

// Write config to a file
const tmpfile = toTempFile(jsLintConfiguration());

// Remove "jsLint" from  command
// Doesn't apply when we use the command as if we used eslint
if (process.argv[2] === "jsLint") {
  process.argv.splice(2, 1);
}

process.argv.push("--config");
process.argv.push(tmpfile);

require(".bin/eslint");
