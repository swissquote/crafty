#!/usr/bin/env node

const log = require("fancy-log");

const cli = require("./cli");
const configuration = require("./configuration");
const getCommands = require("./commands");
const version = require("../package.json").version;

log(`Starting Crafty ${version}...`);

// Initialize the configuration
const crafty = configuration.getCrafty(
  configuration.extractPresets(process.argv),
  configuration.getOverrides()
);

// Get all possible commands
const commands = getCommands(crafty);

// Run the user selected command
cli(crafty, commands).then(
  exitCode => {
    // Wait for the stdout buffer to drain.
    process.on("exit", () => process.exit(exitCode));
  },
  () => {
    process.on("exit", () => process.exit(1));
  }
);
