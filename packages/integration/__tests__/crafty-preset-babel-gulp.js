import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import getCommands from "@swissquote/crafty/src/commands/index";
import * as testUtils from "../utils";

const getCrafty = configuration.getCrafty;

const mainBundle = "dist/js/myBundle.min.js";
const mainBundleMap = "dist/js/myBundle.min.js.map";

test("Loads crafty-preset-babel and does not register gulp tasks", async () => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-babel"], {});

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);

  expect(
    loadedPresets.includes("@swissquote/crafty-preset-babel")
  ).toBeTruthy();

  const commands = getCommands(crafty);
  expect(Object.keys(commands).includes("jsLint")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

test("Loads crafty-preset-babel, crafty-runner-gulp and registers gulp task", async () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-babel", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(
    loadedPresets.includes("@swissquote/crafty-preset-babel")
  ).toBeTruthy();
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

const mainScript = "dist/js/script.js";

test("Compiles JavaScript", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();

  expect(testUtils.exists(cwd, mainScript)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/otherfile.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/otherfile.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, mainScript)).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/otherfile.js")
  ).toMatchSnapshot();
});

test("Compiles JavaScript, keeps runtime external", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();

  expect(testUtils.exists(cwd, mainScript)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/otherfile.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/otherfile.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, mainScript)).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/otherfile.js")
  ).toMatchSnapshot();
});

test("Compiles JavaScript, new features transpiled", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-new-features"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();

  expect(testUtils.exists(cwd, mainScript)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/otherfile.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/otherfile.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, mainScript)).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/otherfile.js")
  ).toMatchSnapshot();
});

test("Compiles JavaScript, target node > 12", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-target-node"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();

  expect(testUtils.exists(cwd, mainScript)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.exists(cwd, "dist/js/otherfile.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/otherfile.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, mainScript)).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/otherfile.js")
  ).toMatchSnapshot();
});

test("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();
});

test("Compiles JavaScript with custom babel plugin", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-babel-plugin"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();

  expect(testUtils.exists(cwd, mainScript)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, mainScript)).toMatchSnapshot();
});

test("Compiles JavaScript with custom babel preset override", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/compiles-babel-preset-override"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();

  expect(testUtils.exists(cwd, mainScript)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, mainScript)).toMatchSnapshot();
});

test("Compiles JavaScript and concatenates", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/concatenates"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, mainBundle)).toBeTruthy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeTruthy();

  expect(testUtils.exists(cwd, mainScript)).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/script.js.map")).toBeFalsy();

  expect(testUtils.exists(cwd, "dist/js/otherfile.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/otherfile.js.map")).toBeFalsy();

  expect(testUtils.readForSnapshot(cwd, mainBundle)).toMatchSnapshot();
});

test("Lints JavaScript", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/lints-es5"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();
});

test("Lints JavaScript, doesn't fail in development", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-gulp/lints-es5-dev"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, mainBundle)).toBeFalsy();
  expect(testUtils.exists(cwd, mainBundleMap)).toBeFalsy();
});
