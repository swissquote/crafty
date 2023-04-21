const test = require("ava");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

const mainBundle = "dist/js/myBundle.min.js";
const mainBundleMap = "dist/js/myBundle.min.js.map";

test("Loads crafty-preset-babel and does not register gulp tasks", async t => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-babel"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );

  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-babel"));

  const commands = getCommands(crafty);
  t.truthy(Object.keys(commands).includes("jsLint"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), []);
});

test("Loads crafty-preset-babel, crafty-runner-gulp and registers gulp task", async t => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-babel"));
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

const mainScript = "dist/js/script.js";

test.serial("Compiles JavaScript", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);

  t.falsy(testUtils.exists(cwd, mainBundle));
  t.falsy(testUtils.exists(cwd, mainBundleMap));

  t.truthy(testUtils.exists(cwd, mainScript));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, mainScript));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/otherfile.js"));
});

test.serial("Compiles JavaScript, keeps runtime external", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);

  t.falsy(testUtils.exists(cwd, mainBundle));
  t.falsy(testUtils.exists(cwd, mainBundleMap));

  t.truthy(testUtils.exists(cwd, mainScript));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, mainScript));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/otherfile.js"));
});

test.serial("Compiles JavaScript, new features transpiled", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-new-features"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);

  t.falsy(testUtils.exists(cwd, mainBundle));
  t.falsy(testUtils.exists(cwd, mainBundleMap));

  t.truthy(testUtils.exists(cwd, mainScript));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, mainScript));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/otherfile.js"));
});

test.serial("Compiles JavaScript, target node > 12", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-target-node"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.falsy(testUtils.exists(cwd, mainBundle));
  t.falsy(testUtils.exists(cwd, mainBundleMap));

  t.truthy(testUtils.exists(cwd, mainScript));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, mainScript));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/otherfile.js"));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  t.falsy(testUtils.exists(cwd, mainBundle));
  t.falsy(testUtils.exists(cwd, mainBundleMap));
});

test.serial("Compiles JavaScript with custom babel plugin", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-babel-plugin"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.falsy(testUtils.exists(cwd, mainBundle));
  t.falsy(testUtils.exists(cwd, mainBundleMap));

  t.truthy(testUtils.exists(cwd, mainScript));
  t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, mainScript));
});

test.serial(
  "Compiles JavaScript with custom babel preset override",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-babel-gulp/compiles-babel-preset-override"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    t.snapshot(result);
    t.is(result.status, 0);

    t.falsy(testUtils.exists(cwd, mainBundle));
    t.falsy(testUtils.exists(cwd, mainBundleMap));

    t.truthy(testUtils.exists(cwd, mainScript));
    t.truthy(testUtils.exists(cwd, "dist/js/script.js.map"));

    t.snapshot(testUtils.readForSnapshot(cwd, mainScript));
  }
);

test.serial("Compiles JavaScript and concatenates", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/concatenates"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, mainBundle));
  t.truthy(testUtils.exists(cwd, mainBundleMap));

  t.falsy(testUtils.exists(cwd, mainScript));
  t.falsy(testUtils.exists(cwd, "dist/js/script.js.map"));

  t.falsy(testUtils.exists(cwd, "dist/js/otherfile.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/otherfile.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, mainBundle));
});

test.serial("Lints JavaScript", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/lints-es5"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, mainBundle));
  t.falsy(testUtils.exists(cwd, mainBundleMap));
});

test.serial("Lints JavaScript, doesn't fail in development", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/lints-es5-dev"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, mainBundle));
  t.falsy(testUtils.exists(cwd, mainBundleMap));
});
