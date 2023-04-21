const test = require("ava");
const configuration = require("@swissquote/crafty/src/configuration");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-typescript and does not register gulp tasks", async t => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-typescript"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-typescript"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), []);
});

test("Loads crafty-preset-typescript, crafty-runner-gulp and registers gulp task", async t => {
  const config = { js: { myBundle: { source: "js/**/*.ts" } } };
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-typescript"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), [
    "js_myBundle",
    "js",
    "default"
  ]);
});

test.serial("Compiles TypeScript", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/script.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/Component.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/Component.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/script.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/Component.js"));
});

test.serial("Compiles TypeScript Modules", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/compiles-modules"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.mjs"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.mjs.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/script.mjs"));
  t.truthy(testUtils.exists(cwd, "dist/js/script.mjs.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/Component.mjs"));
  t.truthy(testUtils.exists(cwd, "dist/js/Component.mjs.map"));

  const script = testUtils.readForSnapshot(cwd, "dist/js/script.mjs");
  t.snapshot(script);

  t.truthy(
    script.indexOf('import test from"./Component.mjs"') > -1,
    "script.mjs should contain 'import test from\"./Component.mjs\"'"
  );

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/Component.mjs"));
});

test.serial("Compiles TypeScript, keeps runtime external", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/script.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/Component.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/Component.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/script.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/Component.js"));
});

test.serial("Compiles TypeScript and concatenates", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/concatenates"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));

  t.falsy(testUtils.exists(cwd, "dist/js/script.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.falsy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Lints TypeScript", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});
