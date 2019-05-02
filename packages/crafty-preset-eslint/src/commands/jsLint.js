#!/usr/bin/env node

const fs = require("fs");

const tmp = require("tmp");

const configurationBuilder = require("../eslintConfigurator");

const configuration = configurationBuilder(process.argv);

process.argv = configuration.args;

const tmpfile = tmp.fileSync({ postfix: ".json" }).name;
fs.writeFileSync(tmpfile, JSON.stringify(configuration.configuration));

// Remove "jsLint" from  command
// Doesn't apply when we use the command as if we used eslint
if (process.argv[2] === "jsLint") {
  process.argv.splice(2, 1);
}

process.argv.push("--config");
process.argv.push(tmpfile);

require("eslint/bin/eslint");
