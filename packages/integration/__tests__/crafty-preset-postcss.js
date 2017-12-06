/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");

const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

it("Loads crafty-preset-postcss and does not register gulp tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-postcss"], {});

  const loadedPresets = [
    require("@swissquote/crafty-preset-postcss"),
    { presetName: "crafty.config.js" }
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toEqual(["cssLint", "run", "watch", "test"]);

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Lints with the command", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss/no-bundle")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["cssLint", "css/*.scss"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist")).toBeFalsy();
});

it("Lints with the command in legacy mode", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss/no-bundle")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["cssLint", "css/*.scss", "--preset", "legacy"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist")).toBeFalsy();
});

it("Lints with the command with custom config", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss/no-bundle")
  );
  rimraf.sync("dist");

  const result = testUtils.run([
    "cssLint",
    "css/*.scss",
    "--config",
    "stylelint.json"
  ]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist")).toBeFalsy();
});
