/* global jest, describe, it, expect */

const fs = require("fs");
const path = require("path");
const configuration = require("@swissquote/crafty/src/configuration");
const testUtils = require("../utils");

const itif = (condition) => condition ? it : it.skip;
const nodeVersion = parseInt(process.version.replace("v", ""));

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

const getCrafty = configuration.getCrafty;

it("Loads crafty-preset-images and does not register gulp tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-images"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain("@swissquote/crafty-preset-images");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Loads crafty-preset-images, crafty-runner-gulp and registers gulp task", () => {
  const crafty = getCrafty(
    ["@swissquote/crafty-preset-images", "@swissquote/crafty-runner-gulp"],
    {}
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain("@swissquote/crafty-preset-images");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-gulp");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "images_all",
    "images_svg",
    "images",
    "default"
  ]);
});

itif(nodeVersion > 10)("Copies and compresses images", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-images");

  const result = await testUtils.run(["run", "images"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/images/batman.svg")).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/images/somedir/cute-cats-2.jpg")
  ).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/images/notcopied.txt")).toBeFalsy();

  expect(
    fs.statSync(path.join(cwd, "dist/images/batman.svg")).size
  ).toBeLessThan(fs.statSync(path.join(cwd, "images/batman.svg")).size);
  expect(
    fs.statSync(path.join(cwd, "dist/images/somedir/cute-cats-2.jpg")).size
  ).toBeLessThan(
    fs.statSync(path.join(cwd, "images/somedir/cute-cats-2.jpg")).size
  );
});

itif(nodeVersion == 10)("Copies and compresses images, Fallback on Node 10", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-images");

  const result = await testUtils.run(["run", "images"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/images/batman.svg")).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/images/somedir/cute-cats-2.jpg")
  ).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/images/notcopied.txt")).toBeFalsy();

  // Compression works for SVG
  expect(
    fs.statSync(path.join(cwd, "dist/images/batman.svg")).size
  ).toBeLessThan(fs.statSync(path.join(cwd, "images/batman.svg")).size);

  // But is skipped for binary formats
  expect(
    fs.statSync(path.join(cwd, "dist/images/somedir/cute-cats-2.jpg")).size
  ).toEqual(
    fs.statSync(path.join(cwd, "images/somedir/cute-cats-2.jpg")).size
  );
});