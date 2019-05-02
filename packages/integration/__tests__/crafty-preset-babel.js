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

it("Loads crafty-preset-babel and does not register webpack tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-babel"], {});

  const loadedPresets = [
    require("@swissquote/crafty-preset-eslint"),
    require("@swissquote/crafty-preset-babel"),
    { presetName: "crafty.config.js" }
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("jsLint");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Loads crafty-preset-babel, crafty-runner-webpack and registers webpack task", () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = getCrafty(
    ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-webpack"],
    config
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-eslint"),
    require("@swissquote/crafty-preset-babel"),
    require("@swissquote/crafty-runner-webpack"),
    Object.assign({ presetName: "crafty.config.js" }, config)
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("jsLint");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

it("Fails on double runner with incorrect bundle assignment", () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-eslint"),
    require("@swissquote/crafty-preset-babel"),
    require("@swissquote/crafty-runner-gulp"),
    require("@swissquote/crafty-runner-webpack"),
    Object.assign({ presetName: "crafty.config.js" }, config)
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  expect(() => crafty.createTasks()).toThrow(
    "You have multiple runners, please specify a runner for 'myBundle'. Available runners are ['gulp/babel', 'webpack']."
  );
});

it("Fails on double runner with imprecise bundle assignment", () => {
  const config = {
    js: { myBundle: { runner: "gulp", source: "css/style.scss" } }
  };
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp"
    ],
    config
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-eslint"),
    require("@swissquote/crafty-preset-babel"),
    require("@swissquote/crafty-preset-typescript"),
    require("@swissquote/crafty-runner-gulp"),
    Object.assign({ presetName: "crafty.config.js" }, config)
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  expect(() => crafty.createTasks()).toThrow(
    "More than one valid runner exists for 'myBundle'. Has to be one of ['gulp/babel', 'gulp/typescript']."
  );
});

it("Fails on non-existing runners", () => {
  const config = {
    js: { myBundle: { runner: "someRunner", source: "css/style.scss" } }
  };
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp"
    ],
    config
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-eslint"),
    require("@swissquote/crafty-preset-babel"),
    require("@swissquote/crafty-preset-typescript"),
    require("@swissquote/crafty-runner-gulp"),
    Object.assign({ presetName: "crafty.config.js" }, config)
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  expect(() => crafty.createTasks()).toThrow(
    "Invalid runner 'someRunner' for 'myBundle'. Has to be one of ['gulp/babel', 'gulp/typescript']."
  );
});

it("Assigns bundle only once when runner is specified", () => {
  const config = {
    js: { myBundle: { runner: "webpack", source: "css/style.scss" } }
  };
  const crafty = getCrafty(
    [
      "@swissquote/crafty-preset-babel",
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-eslint"),
    require("@swissquote/crafty-preset-babel"),
    require("@swissquote/crafty-runner-gulp"),
    require("@swissquote/crafty-runner-webpack"),
    Object.assign({ presetName: "crafty.config.js" }, config)
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("jsLint");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

it("Lints JavaScript using command", () => {
  process.chdir(path.join(__dirname, "../fixtures/crafty-preset-babel/lints"));
  rimraf.sync("dist");

  const result = testUtils.run(["jsLint", "js/**/*.js"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Generates IDE Helper", () => {
  process.chdir(path.join(__dirname, "../fixtures/crafty-preset-babel/ide"));
  rimraf.sync(".eslintrc.js");

  const result = testUtils.run(["ide"]);

  expect(result).toMatchSnapshot();

  expect(
    testUtils.snapshotizeOutput(
      fs.readFileSync(".eslintrc.js").toString("utf8")
    )
  ).toMatchSnapshot();
});

it("Lints JavaScript using command, ignore crafty.config.js", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel/lints-ignore-config")
  );
  rimraf.sync("dist");

  const result = testUtils.run([
    "--preset",
    "@swissquote/crafty-preset-babel",
    "--ignore-crafty-config",
    "jsLint",
    "crafty.config.js"
  ]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript using command, legacy", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel/lints-es5")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["jsLint", "js/**/*.js", "--preset", "legacy"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript using command, recommended preset", () => {
  process.chdir(path.join(__dirname, "../fixtures/crafty-preset-babel/lints"));
  rimraf.sync("dist");

  const result = testUtils.run([
    "jsLint",
    "js/**/*.js",
    "--preset",
    "recommended"
  ]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript using command, explicit configuration", () => {
  process.chdir(path.join(__dirname, "../fixtures/crafty-preset-babel/lints"));
  rimraf.sync("dist");

  const result = testUtils.run([
    "jsLint",
    "js/**/*.js",
    "--config",
    "eslintOverride.json"
  ]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});
