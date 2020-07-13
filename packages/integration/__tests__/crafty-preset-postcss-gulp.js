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
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-gulp/no-bundle"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

it("Doesn't compile without a task, but lints (doesn't throw in development)", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-gulp/no-bundle-dev"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-gulp/fails"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

it("Experiment with all CSS", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-gulp/experiment"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/css/myBundle.min.css")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/myBundle.min.css.map")).toBeTruthy();

  expect(
    testUtils.snapshotizeCSS(
      testUtils.readFile(cwd, "dist/css/myBundle.min.css")
    )
  ).toMatchSnapshot();
});

it("Compiles CSS", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-gulp/compiles"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/css/myBundle.min.css")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/myBundle.min.css.map")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(testUtils.readFile(cwd, "dist/css/myBundle.min.css")).toEqual(
    ".Link{color:#00f}.BodyComponent{margin:0}\n/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});

it("Compiles CSS, configuration has overrides", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-gulp/compiles-with-overrides"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/css/myBundle.min.css")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/myBundle.min.css.map")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/css/imported.scss")).toBeFalsy();

  expect(testUtils.readFile(cwd, "dist/css/myBundle.min.css")).toEqual(
    ".Link{color:#fa5b35}.BodyComponent{margin:0}\n/*# sourceMappingURL=myBundle.min.css.map */\n"
  );
});
