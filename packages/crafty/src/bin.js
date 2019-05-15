#!/usr/bin/env node

const log = require("fancy-log");
const loudRejection = require("loud-rejection");

const cli = require("./cli");
const configuration = require("./configuration");
const getCommands = require("./commands");
const version = require("../package.json").version;

loudRejection();

process.title = "crafty";

log(`Starting Crafty ${version}...`);

let readConfig = true;

if (process.argv.indexOf("--ignore-crafty-config") > -1) {
  process.argv.splice(process.argv.indexOf("--ignore-crafty-config"), 1);
  readConfig = false;
}

// Initialize the configuration
const crafty = configuration.getCrafty(
  configuration.extractPresets(process.argv),
  readConfig ? configuration.getOverrides() : {}
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
