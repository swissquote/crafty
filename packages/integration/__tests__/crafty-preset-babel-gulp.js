/* global jest, describe, it, expect */

const path = require("path");
const rmfr = require("rmfr");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");
const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

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

it("Compiles JavaScript", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-gulp/compiles"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();

  expect(testUtils.exists(cwd, "dist/js/script.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/otherfile.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/otherfile.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, "dist/js/script.js")).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/otherfile.js")
  ).toMatchSnapshot();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-gulp/fails"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Compiles JavaScript with custom babel plugin", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-gulp/compiles-babel-plugin"
  );

  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();

  expect(testUtils.exists(cwd, "dist/js/script.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, "dist/js/script.js")).toMatchSnapshot();
});

it("Compiles JavaScript and concatenates", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-gulp/concatenates"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/script.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeFalsy();

  expect(testUtils.exists(cwd, "dist/js/otherfile.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/otherfile.js.map")).toBeFalsy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
});

it("Lints JavaScript", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-gulp/lints-es5"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript, doesn't fail in development", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-gulp/lints-es5-dev"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
