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

  const loadedPresets = [
    require("@swissquote/crafty-preset-babel"),
    { presetName: "crafty.config.js" }
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toEqual([
    "jsLint",
    "help",
    "run",
    "watch",
    "test"
  ]);

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Loads crafty-preset-babel, crafty-runner-gulp and registers gulp task", () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = getCrafty(
    ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-babel"),
    require("@swissquote/crafty-runner-gulp"),
    Object.assign({ presetName: "crafty.config.js" }, config)
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toEqual([
    "jsLint",
    "help",
    "run",
    "watch",
    "test"
  ]);

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

  expect(
    fs.readFileSync("dist/js/script.js").toString("utf8")
  ).toMatchSnapshot();
  expect(
    fs.readFileSync("dist/js/otherfile.js").toString("utf8")
  ).toMatchSnapshot();
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

  expect(
    fs.readFileSync("dist/js/script.js").toString("utf8")
  ).toMatchSnapshot();
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
    fs.readFileSync("dist/js/myBundle.min.js").toString("utf8")
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
