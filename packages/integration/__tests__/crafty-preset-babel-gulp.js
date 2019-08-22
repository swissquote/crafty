/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");

const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

it("Loads crafty-preset-babel and does not register gulp tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-babel"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );

  expect(loadedPresets).toContain("@swissquote/crafty-preset-babel");

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("jsLint");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Loads crafty-preset-babel, crafty-runner-gulp and registers gulp task", () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = getCrafty(
    ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain("@swissquote/crafty-preset-babel");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-gulp");

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("jsLint");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

it("Compiles JavaScript", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-gulp/compiles")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();

  expect(fs.existsSync("dist/js/script.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/script.js.map")).toBeTruthy();

  expect(fs.existsSync("dist/js/otherfile.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/otherfile.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot("dist/js/script.js")).toMatchSnapshot();
  expect(testUtils.readForSnapshot("dist/js/otherfile.js")).toMatchSnapshot();
});

it("Fails gracefully on broken markup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-gulp/fails")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Compiles JavaScript with custom babel plugin", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-babel-gulp/compiles-babel-plugin"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();

  expect(fs.existsSync("dist/js/script.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot("dist/js/script.js")).toMatchSnapshot();
});

it("Compiles JavaScript and concatenates", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-gulp/concatenates")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeTruthy();

  expect(fs.existsSync("dist/js/script.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/script.js.map")).toBeFalsy();

  expect(fs.existsSync("dist/js/otherfile.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/otherfile.js.map")).toBeFalsy();

  expect(
    testUtils.readForSnapshot("dist/js/myBundle.min.js")
  ).toMatchSnapshot();
});

it("Lints JavaScript", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-gulp/lints-es5")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript, doesn't fail in development", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-gulp/lints-es5-dev")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});
