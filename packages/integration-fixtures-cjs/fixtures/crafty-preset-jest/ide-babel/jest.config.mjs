// AUTOGENERATED BY CRAFTY - DO NOT EDIT
// This file helps IDEs autoconfigure themselves
// any change here will only be used by your IDE, not by Crafty

/* global process */
import { initialize } from "@swissquote/crafty";
import { normalizeJestOptions } from "@swissquote/crafty-preset-jest";

const crafty = await initialize(process.argv);

// Crafty configures its own environment for builds
// tests have different needs
process.env.NODE_ENV = "test";

const config = normalizeJestOptions(crafty, process.argv);
export default config;
