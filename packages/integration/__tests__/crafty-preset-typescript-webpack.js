/* global describe, it, expect, jest */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");

const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

// node-forge 0.6.33 doesn't work with jest.
// but selfsigned is fixed on this version
// as we don't use it for now, we can simply mock it
// https://github.com/jfromaniello/selfsigned/issues/16
jest.mock("node-forge");

it("Loads crafty-preset-typescript and does not register webpack tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-typescript"], {});

  const loadedPresets = [
    require("@swissquote/crafty-preset-typescript"),
    { presetName: "crafty.config.js" }
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toEqual(["tsLint", "help", "run", "watch", "test"]);

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Loads crafty-preset-typescript, crafty-runner-webpack and registers webpack task", () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-typescript"),
    require("@swissquote/crafty-runner-webpack"),
    Object.assign({ presetName: "crafty.config.js" }, config)
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toEqual(["tsLint", "help", "run", "watch", "test"]);

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

it("Compiles TypeScript", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-typescript-webpack/compiles"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(fs.existsSync("dist/js/0.myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/0.myBundle.min.js.map")).toBeTruthy();

  expect(
    fs.readFileSync("dist/js/myBundle.min.js").toString("utf8")
  ).toMatchSnapshot();
  expect(
    fs.readFileSync("dist/js/0.myBundle.min.js").toString("utf8")
  ).toMatchSnapshot();
});

it("Lints TypeScript with webpack", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript-webpack/lints")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  //TODO :: make that TS linting errors throw errors
  // Files aren't generated on failed lint
  //expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  //expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Fails gracefully on broken markup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript-webpack/fails")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});
