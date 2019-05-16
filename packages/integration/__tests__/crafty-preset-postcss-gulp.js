/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");

const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

it("Loads crafty-preset-postcss, crafty-runner-gulp and registers gulp task", () => {
  const config = { myBundle: { source: "css/style.scss" } };
  const crafty = getCrafty(
    ["@swissquote/crafty-preset-postcss", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain("@swissquote/crafty-preset-postcss");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-gulp");

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("cssLint");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "css__lint",
    "default"
  ]);
});

it("Doesn't compile without a task, but lints", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss-gulp/no-bundle")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist")).toBeFalsy();
});

it("Doesn't compile without a task, but lints (doesn't throw in development)", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss-gulp/no-bundle-dev")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist")).toBeFalsy();
});

it("Fails gracefully on broken markup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss-gulp/fails")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist")).toBeFalsy();
});

it("Experiment with all CSS", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss-gulp/experiment")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/css/myBundle.min.css")).toBeTruthy();
  expect(fs.existsSync("dist/css/myBundle.min.css.map")).toBeTruthy();

  expect(
    testUtils.snapshotizeCSS(
      fs.readFileSync("dist/css/myBundle.min.css").toString("utf8")
    )
  ).toMatchSnapshot();
});

it("Compiles CSS", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss-gulp/compiles")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/css/myBundle.min.css")).toBeTruthy();
  expect(fs.existsSync("dist/css/myBundle.min.css.map")).toBeTruthy();
  expect(fs.existsSync("dist/css/imported.scss")).toBeFalsy();

  expect(fs.readFileSync("dist/css/myBundle.min.css").toString("utf8")).toEqual(
    ".Link{color:#00f}.BodyComponent{margin:0}\n/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});

it("Compiles CSS, configuration has overrides", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-postcss-gulp/compiles-with-overrides"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/css/myBundle.min.css")).toBeTruthy();
  expect(fs.existsSync("dist/css/myBundle.min.css.map")).toBeTruthy();
  expect(fs.existsSync("dist/css/imported.scss")).toBeFalsy();

  expect(fs.readFileSync("dist/css/myBundle.min.css").toString("utf8")).toEqual(
    ".Link{color:#fa5b35}.BodyComponent{margin:0}\n/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});
