const { test } = require("node:test");
const { expect } = require("expect");
const configuration = require("../configuration");

test("gets one preset", () => {
  const entry = [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "--preset",
    "@swissquote/crafty-preset-babel",
    "run"
  ];

  expect(configuration.extractConfigurationFromCli(entry)).toEqual({
    readConfig: true,
    presets: ["@swissquote/crafty-preset-babel"]
  });

  expect(entry).toEqual([
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "run"
  ]);
});

test("gets multiple presets", () => {
  const entry = [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "--preset",
    "@swissquote/crafty-preset-babel",
    "--preset",
    "@swissquote/crafty-preset-postcss",
    "run"
  ];

  expect(configuration.extractConfigurationFromCli(entry)).toEqual({
    readConfig: true,
    presets: [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-preset-postcss"
    ]
  });

  expect(entry).toEqual([
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "run"
  ]);
});

test("gets multiple presets, but only before command", () => {
  const entry = [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "--preset",
    "@swissquote/crafty-preset-babel",
    "--preset",
    "@swissquote/crafty-preset-postcss",
    "jsLint",
    "--preset",
    "recommended"
  ];

  expect(configuration.extractConfigurationFromCli(entry)).toEqual({
    readConfig: true,
    presets: [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-preset-postcss"
    ]
  });

  expect(entry).toEqual([
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "jsLint",
    "--preset",
    "recommended"
  ]);
});

test("gets multiple presets and ignore crafty config", () => {
  const entry = [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "--ignore-crafty-config",
    "--preset",
    "@swissquote/crafty-preset-babel",
    "--preset",
    "@swissquote/crafty-preset-postcss",
    "jsLint",
    "--preset",
    "recommended"
  ];

  expect(configuration.extractConfigurationFromCli(entry)).toEqual({
    readConfig: false,
    presets: [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-preset-postcss"
    ]
  });

  expect(entry).toEqual([
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "jsLint",
    "--preset",
    "recommended"
  ]);
});
