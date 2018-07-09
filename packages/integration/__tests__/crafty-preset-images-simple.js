/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");

const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

it("Loads crafty-preset-images-simple and does not register gulp tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-images-simple"], {});

  const loadedPresets = [
    require("@swissquote/crafty-preset-images-simple"),
    { presetName: "crafty.config.js" }
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toEqual(["help", "run", "watch", "test"]);

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Fails if both crafty-preset-images-simple and crafty-preset-images-simple are loaded", () => {
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-images",
      "@swissquote/crafty-preset-images-simple",
      "@swissquote/crafty-runner-gulp"
    ],
    {}
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-images"),
    require("@swissquote/crafty-preset-images-simple"),
    require("@swissquote/crafty-runner-gulp"),
    { presetName: "crafty.config.js" }
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  expect(() => crafty.createTasks()).toThrow(
    "Failed registering 'crafty-preset-images-simple' a task with this name already exists"
  );
});

it("Loads crafty-preset-images-simple, crafty-runner-gulp and registers gulp task", () => {
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-images-simple",
      "@swissquote/crafty-runner-gulp"
    ],
    {}
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-images-simple"),
    require("@swissquote/crafty-runner-gulp"),
    { presetName: "crafty.config.js" }
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toEqual(["help", "run", "watch", "test"]);

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "images",
    "default"
  ]);
});

it("Copies and compresses images", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-images-simple")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "images"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/images/batman.svg")).toBeTruthy();
  expect(fs.existsSync("dist/images/somedir/cute-cats-2.jpg")).toBeTruthy();

  expect(fs.statSync("dist/images/batman.svg").size).toEqual(
    fs.statSync("images/batman.svg").size
  );
  expect(fs.statSync("dist/images/somedir/cute-cats-2.jpg").size).toEqual(
    fs.statSync("images/somedir/cute-cats-2.jpg").size
  );
});
