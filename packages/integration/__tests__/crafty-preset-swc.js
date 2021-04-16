/* global describe, it, expect, jest */

const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");
const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

const getCrafty = configuration.getCrafty;

// node-forge 0.6.33 doesn't work with jest.
// but selfsigned is fixed on this version
// as we don't use it for now, we can simply mock it
// https://github.com/jfromaniello/selfsigned/issues/16
jest.mock("node-forge");

const PRESET_SWC = "@swissquote/crafty-preset-swc";

it("Loads crafty-preset-swc and does not register webpack tasks", () => {
  const crafty = getCrafty([PRESET_SWC], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain(PRESET_SWC);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("jsLint");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

it("Loads crafty-preset-swc, crafty-runner-webpack and registers webpack task", () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = getCrafty(
    [PRESET_SWC, "@swissquote/crafty-runner-webpack"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain(PRESET_SWC);
  expect(loadedPresets).toContain("@swissquote/crafty-runner-webpack");

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
      PRESET_SWC,
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain(PRESET_SWC);
  expect(loadedPresets).toContain("@swissquote/crafty-runner-gulp");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-webpack");

  expect(() => crafty.createTasks()).toThrow(
    "You have multiple runners, please specify a runner for 'myBundle'. Available runners are ['gulp/swc', 'webpack']."
  );
});

it("Fails on double runner with imprecise bundle assignment", () => {
  const config = {
    js: { myBundle: { runner: "gulp", source: "css/style.scss" } }
  };
  const crafty = getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain(PRESET_SWC);
  expect(loadedPresets).toContain("@swissquote/crafty-preset-typescript");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-gulp");

  expect(() => crafty.createTasks()).toThrow(
    "More than one valid runner exists for 'myBundle'. Has to be one of ['gulp/swc', 'gulp/typescript']."
  );
});

it("Fails on non-existing runners", () => {
  const config = {
    js: { myBundle: { runner: "someRunner", source: "css/style.scss" } }
  };
  const crafty = getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain(PRESET_SWC);
  expect(loadedPresets).toContain("@swissquote/crafty-preset-typescript");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-gulp");

  expect(() => crafty.createTasks()).toThrow(
    "Invalid runner 'someRunner' for 'myBundle'. Has to be one of ['gulp/swc', 'gulp/typescript']."
  );
});

it("Assigns bundle only once when runner is specified", () => {
  const config = {
    js: { myBundle: { runner: "webpack", source: "css/style.scss" } }
  };
  const crafty = getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  expect(loadedPresets).toContain(PRESET_SWC);
  expect(loadedPresets).toContain("@swissquote/crafty-runner-gulp");
  expect(loadedPresets).toContain("@swissquote/crafty-runner-webpack");

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("jsLint");

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

it("Lints JavaScript using command", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(["jsLint", "js/**/*.js"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Generates IDE Helper", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/ide", [
    ".eslintrc.js",
    "prettier.config.js",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.readForSnapshot(cwd, ".eslintrc.js")).toMatchSnapshot();

  expect(
    testUtils.readForSnapshot(cwd, "prettier.config.js")
  ).toMatchSnapshot();

  expect(testUtils.readForSnapshot(cwd, ".gitignore")).toMatchSnapshot();
});

it("Lints JavaScript using command, ignore crafty.config.js", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc/lints-ignore-config"
  );

  const result = await testUtils.run(
    [
      "--preset",
      PRESET_SWC,
      "--ignore-crafty-config",
      "jsLint",
      "crafty.config.js"
    ],
    cwd
  );

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript using command, legacy", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints-es5");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "legacy"],
    cwd
  );

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript using command, format preset", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "format"],
    cwd
  );

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript using command, recommended preset", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "recommended"],
    cwd
  );

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript using command, explicit configuration", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--config", "eslintOverride.json"],
    cwd
  );

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
