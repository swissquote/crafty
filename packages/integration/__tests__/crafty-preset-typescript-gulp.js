import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import * as testUtils from "../utils";

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-typescript and does not register gulp tasks", async () => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-typescript"], {});

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(
    loadedPresets.includes("@swissquote/crafty-preset-typescript")
  ).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

test("Loads crafty-preset-typescript, crafty-runner-gulp and registers gulp task", async () => {
  const config = { js: { myBundle: { source: "js/**/*.ts" } } };
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-typescript", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(
    loadedPresets.includes("@swissquote/crafty-preset-typescript")
  ).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

test("Compiles TypeScript", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();

  expect(testUtils.exists(cwd, "dist/js/script.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/Loading.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/Loading.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, "dist/js/script.js")).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/Loading.js")
  ).toMatchSnapshot();
});

test("Compiles TypeScript, alternate conf", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/compiles-alternate-conf"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();

  expect(testUtils.exists(cwd, "dist/js/script.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/Loading.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/Loading.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, "dist/js/script.js")).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/Loading.js")
  ).toMatchSnapshot();
});

test("Compiles TypeScript Modules", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/compiles-modules"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.mjs")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.mjs.map")).toBeFalsy();

  expect(testUtils.exists(cwd, "dist/js/script.mjs")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.mjs.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/Component.mjs")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/Component.mjs.map")).toBeTruthy();

  const script = testUtils.readForSnapshot(cwd, "dist/js/script.mjs");
  expect(script).toMatchSnapshot();

  expect(script.indexOf('import test from"./Component.mjs"') > -1).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/Component.mjs")
  ).toMatchSnapshot();
});

test("Compiles TypeScript, keeps runtime external", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

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

test("Compiles TypeScript and concatenates", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/concatenates"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

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

test("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Lints TypeScript", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-gulp/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
