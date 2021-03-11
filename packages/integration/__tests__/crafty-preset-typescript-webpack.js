/* global describe, it, expect, jest */

const fs = require("fs");
const path = require("path");
const configuration = require("@swissquote/crafty/src/configuration");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

// node-forge 0.6.33 doesn't work with jest.
// but selfsigned is fixed on this version
// as we don't use it for now, we can simply mock it
// https://github.com/jfromaniello/selfsigned/issues/16
jest.mock("node-forge");

it("Loads crafty-preset-typescript and does not register webpack tasks", () => {
  const crafty = getCrafty(["@swissquote/crafty-preset-typescript"], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain("@swissquote/crafty-preset-typescript");

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

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain("@swissquote/crafty-preset-typescript");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-webpack");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

it("Compiles TypeScript", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/570.myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/570.myBundle.min.js.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/570.myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/js/SomeLibrary.d.ts")
  ).toMatchSnapshot();
});

it("Compiles TypeScript - fork checker", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/compiles-forked"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/someLibrary.myBundle.min.js")
  ).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/someLibrary.myBundle.min.js.map")
  ).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/someLibrary.myBundle.min.js")
  ).toMatchSnapshot();
});

it("Lints TypeScript with webpack", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeFalsy();
});

it("Fails gracefully on invalid TS", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/invalid"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed types
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeFalsy();
});

it("Fails gracefully on invalid TS - fork checker", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/invalid-forked"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed types
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeFalsy();
});

it("Removes unused classes", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-webpack/tree-shaking"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();

  const content = fs
    .readFileSync(path.join(cwd, "dist/js/myBundle.min.js"))
    .toString("utf8");

  expect(content.indexOf("From class A") > -1).toBeTruthy();
  expect(content.indexOf("From class B") > -1).toBeFalsy();
});
