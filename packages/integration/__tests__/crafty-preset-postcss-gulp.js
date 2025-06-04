import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import getCommands from "@swissquote/crafty/src/commands/index.js";

import * as testUtils from "../utils.js";

const BUNDLED_CSS = "dist/css/myBundle.min.css";
const BUNDLED_CSS_MAPS = "dist/css/myBundle.min.css.map";

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-postcss, crafty-runner-gulp and registers gulp task", async () => {
  const config = { myBundle: { source: "css/style.scss" } };
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-postcss", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes("@swissquote/crafty-preset-postcss")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();

  const commands = getCommands(crafty);
  expect(Object.keys(commands).includes("cssLint")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "css__lint",
    "default"
  ]);
});

test("Doesn't compile without a task, but lints", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/no-bundle"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

test(
  "Doesn't compile without a task, but lints (doesn't throw in development)",
  async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-postcss-gulp/no-bundle-dev"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist")).toBeFalsy();
  }
);

test("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

test("Experiment with all CSS", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/experiment"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();

  expect(testUtils.snapshotizeCSS(testUtils.readFile(cwd, BUNDLED_CSS))).toMatchSnapshot();
});

test("Experiment with all CSS, old browsers", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/experiment_old_browsers"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();

  expect(testUtils.snapshotizeCSS(testUtils.readFile(cwd, BUNDLED_CSS))).toMatchSnapshot();
});

test("Compiles CSS", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(
    testUtils.readFile(cwd, BUNDLED_CSS)
  ).toBe(
    ".Link{color:#00f}.BodyComponent{margin:0}/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});

test("Compiles CSS, configuration has overrides", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles-with-overrides"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(
    testUtils.readFile(cwd, BUNDLED_CSS)
  ).toBe(
    ".Link{color:#fa5b35}.BodyComponent{margin:0}/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});

test("Compiles CSS, configuration preserve", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles-preserve"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(
    testUtils.readFile(cwd, BUNDLED_CSS)
  ).toBe(
    ":root{--color:blue}" +
      ".Link{color:var(--color)}" +
      ":root{--BodyComponent-color:var(--color)}" +
      ".BodyComponent{color:var(--BodyComponent-color);margin:0}" +
      "/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});

test("Compiles CSS, compiles color-function", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles-color-function"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(
    testUtils.readFile(cwd, BUNDLED_CSS)
  ).toBe(
    ":root{--color-default:#d1d1d1;--color-light:var(--color-default)}.Button{color:#fafafa;background-color:var(--color-light)}" +
      "/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});
