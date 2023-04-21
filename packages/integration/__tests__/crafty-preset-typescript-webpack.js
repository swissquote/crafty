const test = require("ava");
const fs = require("fs");
const path = require("path");
const configuration = require("@swissquote/crafty/src/configuration");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-typescript and does not register webpack tasks", async t => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-typescript"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-typescript"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), []);
});

test("Loads crafty-preset-typescript, crafty-runner-webpack and registers webpack task", async t => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    [
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-typescript"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-webpack"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), [
    "js_myBundle",
    "js",
    "default"
  ]);
});

test.serial("Compiles TypeScript", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
  t.truthy(testUtils.exists(cwd, "dist/js/361.myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/361.myBundle.min.js.map"));
  t.truthy(testUtils.exists(cwd, "dist/js/js/SomeLibrary.d.ts"));
  t.truthy(testUtils.exists(cwd, "dist/js/js/Component.d.ts"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/361.myBundle.min.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/js/SomeLibrary.d.ts"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/js/Component.d.ts"));
});

test.serial("Compiles TypeScript - fork checker", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/compiles-forked"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
  t.truthy(testUtils.exists(cwd, "dist/js/someLibrary.myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/someLibrary.myBundle.min.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
  t.snapshot(
    testUtils.readForSnapshot(cwd, "dist/js/someLibrary.myBundle.min.js")
  );
});

test.serial("Lints TypeScript with webpack", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map"));
});

test.serial("Fails gracefully on invalid TS", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/invalid"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed types
  t.falsy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map"));
});

test.serial("Fails gracefully on invalid TS - fork checker", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/invalid-forked"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed types
  t.falsy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map"));
});

test.serial("Removes unused classes", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/tree-shaking"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));

  const content = fs
    .readFileSync(path.join(cwd, "dist/js/myBundle.min.js"))
    .toString("utf8");

  t.truthy(content.indexOf("From class A") > -1);
  t.falsy(content.indexOf("From class B") > -1);
});
