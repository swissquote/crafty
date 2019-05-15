/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");
const configuration = require("@swissquote/crafty/src/configuration");

const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

it("Loads crafty-preset-typescript and does not register gulp tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-typescript"], {});

  const loadedPresets = [
    require("@swissquote/crafty-preset-eslint"),
    require("@swissquote/crafty-preset-typescript"),
    { presetName: "crafty.config.js" }
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Loads crafty-preset-typescript, crafty-runner-gulp and registers gulp task", () => {
  const config = { js: { myBundle: { source: "js/**/*.ts" } } };
  const crafty = getCrafty(
    ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = [
    require("@swissquote/crafty-preset-eslint"),
    require("@swissquote/crafty-preset-typescript"),
    require("@swissquote/crafty-runner-gulp"),
    Object.assign({ presetName: "crafty.config.js" }, config)
  ];

  expect(crafty.config.loadedPresets).toEqual(loadedPresets);

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

it("Compiles TypeScript", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript-gulp/compiles")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();

  expect(fs.existsSync("dist/js/script.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/script.js.map")).toBeTruthy();

  expect(fs.existsSync("dist/js/Component.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/Component.js.map")).toBeTruthy();

  expect(
    fs.readFileSync("dist/js/script.js").toString("utf8")
  ).toMatchSnapshot();
  expect(
    fs.readFileSync("dist/js/Component.js").toString("utf8")
  ).toMatchSnapshot();
});

it("Compiles TypeScript and concatenates", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-typescript-gulp/concatenates"
    )
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

it("Fails gracefully on broken markup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript-gulp/fails")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints TypeScript", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript-gulp/lints")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});
