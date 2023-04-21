const test = require("ava");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-swc and does not register gulp tasks", async t => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-swc"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );

  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-swc"));

  const commands = getCommands(crafty);
  t.truthy(Object.keys(commands).includes("jsLint"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), []);
});

test("Loads crafty-preset-swc, crafty-runner-gulp and registers gulp task", async t => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-swc"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));

  const commands = getCommands(crafty);
  t.truthy(Object.keys(commands).includes("jsLint"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), [
    "js_myBundle",
    "js",
    "default"
  ]);
});

test.serial("Compiles JavaScript", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/script.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/script.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/otherfile.js"));
});

test.serial("Compiles JavaScript, keeps runtime external", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/script.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/script.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/otherfile.js"));
});

test.serial("Compiles JavaScript, new features transpiled", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/compiles-new-features"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/script.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/script.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/otherfile.js"));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc-gulp/fails");

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Compiles JavaScript and concatenates", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/concatenates"
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

test.serial("Lints JavaScript", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/lints-es5"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Lints JavaScript, doesn't fail in development", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/lints-es5-dev"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});
