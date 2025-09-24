import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import getCommands from "@swissquote/crafty/src/commands/index";
import * as testUtils from "../utils.js";

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-swc and does not register gulp tasks", async () => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-swc"], {});

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);

  expect(loadedPresets.includes("@swissquote/crafty-preset-swc")).toBeTruthy();

  const commands = getCommands(crafty);
  expect(Object.keys(commands).includes("jsLint")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

test("Loads crafty-preset-swc, crafty-runner-gulp and registers gulp task", async () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-swc", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes("@swissquote/crafty-preset-swc")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();

  const commands = getCommands(crafty);
  expect(Object.keys(commands).includes("jsLint")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

test("Compiles JavaScript", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

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

test("Compiles JavaScript, keeps runtime external", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

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

test("Compiles JavaScript, new features transpiled", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/compiles-new-features"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

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

test("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc-gulp/fails");

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Compiles JavaScript and concatenates", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/concatenates"
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

test("Lints JavaScript", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/lints-es5"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Lints JavaScript, doesn't fail in development", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-gulp/lints-es5-dev"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
