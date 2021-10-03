/* global jest, describe, it, expect */

const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");

const testUtils = require("../utils");

const BUNDLED_CSS = "dist/css/myBundle.min.css";
const BUNDLED_CSS_MAPS = "dist/css/myBundle.min.css.map";

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

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

it("Doesn't compile without a task, but lints", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/no-bundle"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

it("Doesn't compile without a task, but lints (doesn't throw in development)", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/no-bundle-dev"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(0);
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(1);
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

it("Experiment with all CSS", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/experiment"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(0);
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();

  expect(
    testUtils.snapshotizeCSS(testUtils.readFile(cwd, BUNDLED_CSS))
  ).toMatchSnapshot();
});

it("Experiment with all CSS, old browsers", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/experiment_old_browsers"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(0);
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();

  expect(
    testUtils.snapshotizeCSS(testUtils.readFile(cwd, BUNDLED_CSS))
  ).toMatchSnapshot();
});

it("Compiles CSS", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(0);
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(testUtils.readFile(cwd, BUNDLED_CSS)).toEqual(
    ".Link{color:#00f}.BodyComponent{margin:0}\n/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});

it("Compiles CSS, configuration has overrides", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles-with-overrides"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(0);
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(testUtils.readFile(cwd, BUNDLED_CSS)).toEqual(
    ".Link{color:#fa5b35}.BodyComponent{margin:0}\n/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});

it("Compiles CSS, configuration preserve", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles-preserve"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(0);
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLED_CSS)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLED_CSS_MAPS)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(testUtils.readFile(cwd, BUNDLED_CSS)).toEqual(
    ":root{--color:blue}" +
      ".Link{color:#fa5b35;color:var(--color)}" +
      ":root{--BodyComponent-color:var(--color)}" +
      ".BodyComponent{color:#fa5b35;color:var(--BodyComponent-color);margin:0}\n" +
      "/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});
