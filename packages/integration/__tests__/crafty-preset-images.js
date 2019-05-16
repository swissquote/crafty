/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");
const configuration = require("@swissquote/crafty/src/configuration");

const testUtils = require("../utils");

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

it("Copies and compresses images", () => {
  process.chdir(path.join(__dirname, "../fixtures/crafty-preset-images"));
  rimraf.sync("dist");

  const result = testUtils.run(["run", "images"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/images/batman.svg")).toBeTruthy();
  expect(fs.existsSync("dist/images/somedir/cute-cats-2.jpg")).toBeTruthy();
  expect(fs.existsSync("dist/images/notcopied.txt")).toBeFalsy();

  expect(fs.statSync("dist/images/batman.svg").size).toBeLessThan(
    fs.statSync("images/batman.svg").size
  );
  expect(fs.statSync("dist/images/somedir/cute-cats-2.jpg").size).toBeLessThan(
    fs.statSync("images/somedir/cute-cats-2.jpg").size
  );
});
