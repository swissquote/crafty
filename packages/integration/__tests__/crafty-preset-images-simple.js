const test = require("ava");
const fs = require("fs");
const path = require("path");
const configuration = require("@swissquote/crafty/src/configuration");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-images-simple and does not register gulp tasks", t => {
  const crafty = getCrafty(["@swissquote/crafty-preset-images-simple"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-images-simple"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), []);
});

test("Fails if both crafty-preset-images-simple and crafty-preset-images-simple are loaded", t => {
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-images",
      "@swissquote/crafty-preset-images-simple",
      "@swissquote/crafty-runner-gulp"
    ],
    {}
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-images"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-images-simple"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));

  t.throws(() => crafty.createTasks(), {
    message:
      "Failed registering 'crafty-preset-images-simple' a task with this name already exists"
  });
});

test("Loads crafty-preset-images-simple, crafty-runner-gulp and registers gulp task", t => {
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-images-simple",
      "@swissquote/crafty-runner-gulp"
    ],
    {}
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-images-simple"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), [
    "images",
    "default"
  ]);
});

test.serial("Copies and compresses images", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-images-simple");

  const result = await testUtils.run(["run", "images"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/images/batman.svg"));
  t.truthy(testUtils.exists(cwd, "dist/images/somedir/cute-cats-2.jpg"));

  t.deepEqual(
    fs.statSync(path.join(cwd, "dist/images/batman.svg")).size,
    fs.statSync(path.join(cwd, "images/batman.svg")).size
  );
  t.deepEqual(
    fs.statSync(path.join(cwd, "dist/images/somedir/cute-cats-2.jpg")).size,
    fs.statSync(path.join(cwd, "images/somedir/cute-cats-2.jpg")).size
  );
});
