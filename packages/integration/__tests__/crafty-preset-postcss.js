const test = require("ava");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");

const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-postcss and does not register gulp tasks", t => {
  const crafty = getCrafty(["@swissquote/crafty-preset-postcss"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-postcss"));

  const commands = getCommands(crafty);
  t.truthy(Object.keys(commands).includes("cssLint"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), []);
});

test.serial("Lints with the command", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss/no-bundle"
  );

  const result = await testUtils.run(["cssLint", "css/*.scss"], cwd);

  t.snapshot(result);
  t.is(result.status, 2);

  t.falsy(testUtils.exists(cwd, "dist"));
});

test.serial("Lints with the command in legacy mode", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss/no-bundle"
  );

  const result = await testUtils.run(
    ["cssLint", "css/*.scss", "--preset", "legacy"],
    cwd
  );

  t.snapshot(result);
  t.is(result.status, 2);

  t.falsy(testUtils.exists(cwd, "dist"));
});

test.serial("Lints with the command with custom config", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss/no-bundle"
  );

  const result = await testUtils.run(
    ["cssLint", "css/*.scss", "--config", "stylelint.json"],
    cwd
  );

  t.snapshot(result);
  t.is(result.status, 2);

  t.falsy(testUtils.exists(cwd, "dist"));
});

test.serial("Creates IDE Integration files", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-postcss/ide", [
    "stylelint.config.js",
    "prettier.config.js",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
  t.snapshot(testUtils.readForSnapshot(cwd, "stylelint.config.js"));

  t.snapshot(testUtils.readForSnapshot(cwd, "prettier.config.js"));

  t.snapshot(testUtils.readForSnapshot(cwd, ".gitignore"));
});
