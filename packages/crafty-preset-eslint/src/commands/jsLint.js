#!/usr/bin/env node

const { configurationBuilder, toTempFile } = require("../eslintConfigurator");

const configuration = configurationBuilder(process.argv);

process.argv = configuration.args;

const tmpfile = toTempFile(configuration.configuration);

// Remove "jsLint" from  command
// Doesn't apply when we use the command as if we used eslint
if (process.argv[2] === "jsLint") {
  process.argv.splice(2, 1);
}

process.argv.push("--config");
process.argv.push(tmpfile);

require(".bin/eslint");
