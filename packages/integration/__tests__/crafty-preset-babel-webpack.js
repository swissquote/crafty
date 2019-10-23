/* global describe, it, expect */

const path = require("path");
const rmfr = require("rmfr");
const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

const BUNDLE = "dist/js/myBundle.min.js";
const BUNDLE_MAP = `${BUNDLE}.map`;

it("Compiles JavaScript", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/compiles"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Compiles Generators", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/compiles-generators"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Deduplicates helpers", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/compiles-deduplicates"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Does not transpile on modern browsers", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/no-old-browser"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Compiles JavaScript with externals", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/externals"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Creates profiles", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/profiles"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default", "--profile"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle_report.html")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle_stats.json")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Lints JavaScript with webpack", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/lints"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, BUNDLE)).toBeFalsy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeFalsy();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/fails"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, BUNDLE)).toBeFalsy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeFalsy();
});

it("Removes unused classes", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-babel-webpack/tree-shaking"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  const content = testUtils.readFile(cwd, BUNDLE);

  expect(content.indexOf("From class A") > -1).toBeTruthy();
  expect(content.indexOf("From class B") > -1).toBeFalsy();
});
