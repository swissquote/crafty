import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import getCommands from "@swissquote/crafty/src/commands/index";
import * as testUtils from "../utils.js";

const getCrafty = configuration.getCrafty;

const PRESET_SWC = "@swissquote/crafty-preset-swc";

test("Loads crafty-preset-swc and does not register webpack tasks", async () => {
  const crafty = await getCrafty([PRESET_SWC], {});

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes(PRESET_SWC)).toBeTruthy();

  const commands = getCommands(crafty);
  expect(Object.keys(commands).includes("jsLint")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

test("Loads crafty-preset-swc, crafty-runner-webpack and registers webpack task", async () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    [PRESET_SWC, "@swissquote/crafty-runner-webpack"],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes(PRESET_SWC)).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-webpack")).toBeTruthy();

  const commands = getCommands(crafty);
  expect(Object.keys(commands).includes("jsLint")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

test("Fails on double runner with incorrect bundle assignment", async () => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes(PRESET_SWC)).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-webpack")).toBeTruthy();

  expect(() => crafty.createTasks()).toThrow(
    "You have multiple runners, please specify a runner for 'myBundle'. Available runners are ['gulp/swc', 'webpack']."
  );
});

test("Fails on double runner with imprecise bundle assignment", async () => {
  const config = {
    js: { myBundle: { runner: "gulp", source: "css/style.scss" } }
  };
  const crafty = await getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp"
    ],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes(PRESET_SWC)).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-preset-typescript")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();

  expect(() => crafty.createTasks()).toThrow(
    "More than one valid runner exists for 'myBundle'. Has to be one of ['gulp/swc', 'gulp/typescript']."
  );
});

test("Fails on non-existing runners", async () => {
  const config = {
    js: { myBundle: { runner: "someRunner", source: "css/style.scss" } }
  };
  const crafty = await getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp"
    ],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes(PRESET_SWC)).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-preset-typescript")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();

  expect(() => crafty.createTasks()).toThrow(
    "Invalid runner 'someRunner' for 'myBundle'. Has to be one of ['gulp/swc', 'gulp/typescript']."
  );
});

test("Assigns bundle only once when runner is specified", async () => {
  const config = {
    js: { myBundle: { runner: "webpack", source: "css/style.scss" } }
  };
  const crafty = await getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes(PRESET_SWC)).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-webpack")).toBeTruthy();

  const commands = getCommands(crafty);
  expect(Object.keys(commands).includes("jsLint")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "js_myBundle",
    "js",
    "default"
  ]);
});

test("Lints JavaScript using command", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(["jsLint", "js/**/*.js"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Lints with additional plugin - command", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints-additional-plugin");

  const result = await testUtils.run(["eslint", "js/**/*.js"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Lints with additional plugin - webpack", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints-additional-plugin");

  const result = await testUtils.run(["run", "js_webpack"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Lints with additional plugin - gulp", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints-additional-plugin");

  const result = await testUtils.run(["run", "js_gulp"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Generates IDE Helper", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/ide", [
    "eslint.config.mjs",
    "prettier.config.mjs",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.readForSnapshot(cwd, "eslint.config.mjs")).toMatchSnapshot();

  expect(testUtils.readForSnapshot(cwd, "prettier.config.mjs")).toMatchSnapshot();
});

test(
  "Lints JavaScript using command, ignore crafty.config.js",
  async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-swc/lints-ignore-config"
    );

    const result = await testUtils.run(
      ["--preset", PRESET_SWC, "--ignore-crafty-config", "jsLint", "*.js"],
      cwd
    );

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  }
);

test("Lints JavaScript using command, legacy", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints-es5");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "legacy"],
    cwd
  );

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Lints JavaScript using command, format preset", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "format"],
    cwd
  );

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test("Lints JavaScript using command, recommended preset", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "recommended"],
    cwd
  );

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

test(
  "Lints JavaScript using command, respects .eslintignore",
  async () => {
    const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints-eslintignore");

    const result = await testUtils.run(
      ["eslint", "js"],
      cwd
    );

    expect(result).toMatchSnapshot();
    expect(result.stdall.includes("js/script.js")).toBeTruthy();
    expect(result.stdall.includes("js/Component.js")).toBeFalsy();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  }
);

test(
  "Lints JavaScript using command, explicit configuration - json",
  async () => {
    const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

    const result = await testUtils.run(
      ["jsLint", "js/**/*.js", "--config", "eslintOverride.json"],
      cwd
    );

    expect(result).toMatchSnapshot();
    expect(result.stdall.includes("Unexpected use of continue statement")).toBeTruthy();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  }
);

test(
  "Lints JavaScript using command, explicit configuration - cjs",
  async () => {
    const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

    const result = await testUtils.run(
      ["jsLint", "js/**/*.js", "--config", "eslintOverride.cjs"],
      cwd
    );

    expect(result).toMatchSnapshot();
    expect(result.stdall.includes("Unexpected use of continue statement")).toBeTruthy();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  }
);

test(
  "Lints JavaScript using command, explicit configuration - mjs",
  async () => {
    const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

    const result = await testUtils.run(
      ["jsLint", "js/**/*.js", "--config", "eslintOverride.mjs"],
      cwd
    );

    expect(result).toMatchSnapshot();
    expect(result.stdall.includes("Unexpected use of continue statement")).toBeTruthy();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  }
);
