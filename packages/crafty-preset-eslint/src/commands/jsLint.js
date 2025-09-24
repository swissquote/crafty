#!/usr/bin/env node

const { toTempFile, commandConfiguration } = require("../templates.js");

/**
 * Extract all configuration from "crafty jsLint" that won't be understood by `eslint`
 *
 * @param {*} args
 * @returns
 */
function extractConfig(args) {
  const presets = [];
  let configFile;

  let idx;
  if (args.indexOf("--preset") > -1) {
    while ((idx = args.indexOf("--preset")) > -1) {
      presets.push(args[idx + 1]);

      args.splice(idx, 2);
    }
  }

  if ((idx = args.indexOf("--config")) > -1) {
    configFile = args[idx + 1];
    args.splice(idx, 2);
  }

  return {
    presets,
    configFile
  };
}

function runESLint(crafty) {
  // Force flat config mode
  process.env.ESLINT_USE_FLAT_CONFIG = "true";

  // Write config to a file
  const tmpfile = toTempFile(
    commandConfiguration(crafty, extractConfig(process.argv))
  );

  // Remove "jsLint" from  command
  // Doesn't apply when we use the command as if we used eslint
  if (process.argv[2] === "jsLint" || process.argv[2] === "eslint") {
    process.argv.splice(2, 1);
  }

  process.argv.push("--config");
  process.argv.push(tmpfile);

  require(".bin/eslint");
}

module.exports = runESLint;

// Call ESLint immediately, allows to use this file as a CLI tool
if (require.main === module) {
  import("@swissquote/crafty").then(async ({ initialize }) => {
    const crafty = await initialize([], {
      readConfig: false,
      presets: ["@swissquote/crafty-preset-eslint"]
    });

    runESLint(crafty);
  });
}
