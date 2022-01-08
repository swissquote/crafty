const test = require("ava");
const configuration = require("../configuration");

test("gets one preset", t => {
  const entry = [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "--preset",
    "@swissquote/crafty-preset-babel",
    "run"
  ];

  t.deepEqual(configuration.extractPresets(entry), [
    "@swissquote/crafty-preset-babel"
  ]);

  t.deepEqual(entry, [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "run"
  ]);
});

test("gets multiple presets", t => {
  const entry = [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "--preset",
    "@swissquote/crafty-preset-babel",
    "--preset",
    "@swissquote/crafty-preset-postcss",
    "run"
  ];

  t.deepEqual(configuration.extractPresets(entry), [
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-postcss"
  ]);

  t.deepEqual(entry, [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "run"
  ]);
});

test("gets multiple presets, but only before command", t => {
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

  t.deepEqual(configuration.extractPresets(entry), [
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-postcss"
  ]);

  t.deepEqual(entry, [
    "/usr/local/Cellar/node/8.1.0_1/bin/node",
    "__PATH__/packages/integration/node_modules/crafty/src/bin.js",
    "jsLint",
    "--preset",
    "recommended"
  ]);
});
