const test = require("ava");
const fs = require("fs");
const path = require("path");
const configuration = require("@swissquote/crafty/src/configuration");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-images and does not register gulp tasks", async t => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-images"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-images"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), []);
});

test("Loads crafty-preset-images, crafty-runner-gulp and registers gulp task", async t => {
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-images", "@swissquote/crafty-runner-gulp"],
    {}
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-images"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), [
    "images_all",
    "images_svg",
    "images",
    "default"
  ]);
});

test.serial("Copies and compresses images", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-images");

  const result = await testUtils.run(["run", "images"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/images/batman.svg"));
  t.truthy(testUtils.exists(cwd, "dist/images/somedir/cute-cats-2.jpg"));
  t.falsy(testUtils.exists(cwd, "dist/images/notcopied.txt"));

  t.truthy(
    fs.statSync(path.join(cwd, "dist/images/batman.svg")).size <
      fs.statSync(path.join(cwd, "images/batman.svg")).size
  );
  t.truthy(
    fs.statSync(path.join(cwd, "dist/images/somedir/cute-cats-2.jpg")).size <
      fs.statSync(path.join(cwd, "images/somedir/cute-cats-2.jpg")).size
  );
});
