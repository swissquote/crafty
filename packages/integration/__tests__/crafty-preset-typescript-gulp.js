/* global describe, it, expect */

const path = require("path");
const rmfr = require("rmfr");
const configuration = require("@swissquote/crafty/src/configuration");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

it("Loads crafty-preset-typescript and does not register gulp tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-typescript"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain("@swissquote/crafty-preset-typescript");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Loads crafty-preset-typescript, crafty-runner-gulp and registers gulp task", () => {
  const config = { js: { myBundle: { source: "js/**/*.ts" } } };
  const crafty = getCrafty(
    ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain("@swissquote/crafty-preset-typescript");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-gulp");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

it("Compiles TypeScript", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-typescript-gulp/compiles"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();

  expect(testUtils.exists(cwd, "dist/js/script.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/Component.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/Component.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, "dist/js/script.js")).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/Component.js")
  ).toMatchSnapshot();
});

it("Compiles TypeScript and concatenates", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-typescript-gulp/concatenates"
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

it("Fails gracefully on broken markup", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-typescript-gulp/fails"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints TypeScript", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-typescript-gulp/lints"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
