/* global test, expect */
const configuration = require("../configuration");

test("gets one preset", () => {
  const entry = [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "--preset",
    "@swissquote/crafty-preset-babel",
    "run"
  ];

  expect(configuration.extractPresets(entry)).toEqual([
    "@swissquote/crafty-preset-babel"
  ]);

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

  expect(configuration.extractPresets(entry)).toEqual([
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-postcss"
  ]);

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

  expect(configuration.extractPresets(entry)).toEqual([
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-postcss"
  ]);

  expect(entry).toEqual([
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "jsLint",
    "--preset",
    "recommended"
  ]);
});
