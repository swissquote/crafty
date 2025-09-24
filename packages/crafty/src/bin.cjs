#!/usr/bin/env node

"use strict";

const log = require("@swissquote/crafty-commons/packages/fancy-log");
const loudRejection = require("../packages/loud-rejection");

const cli = require("./cli");
const configuration = require("./configuration");
const getCommands = require("./commands");
const version = require("../package.json").version;

loudRejection();

process.title = "crafty";

log(`Starting Crafty ${version}...`);

// Initialize the configuration
configuration.initialize(process.argv).then(
  async crafty => {
    // Get all possible commands
    const commands = getCommands(crafty);

    try {
      // Run the user selected command
      const exitCode = await cli(crafty, commands);

      if (exitCode) {
        process.exitCode = exitCode;
      }
    } catch (error) {
      // Using crafty.error will make sure that it won't
      // show an error that was already shown
      crafty.error(error);

      process.exitCode = 1;
    }
  },
  e => {
    console.error("Could not initialize Crafty", e);
  }
);
