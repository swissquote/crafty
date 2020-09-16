/* global jest, describe, it, expect */

const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

const BUNDLE = "dist/js/myBundle.min.js";
const BUNDLE_MAP = "dist/js/myBundle.min.js.map";

it("Compiles JavaScript with rollup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-rollup/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Keeps imports unresolved for Babel Runtime", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-rollup/compiles-import-runtime"
  );
  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Keeps imports unresolved for Babel Runtime, using commonjs", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-rollup/compiles-import-runtime-commonjs"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-rollup/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, BUNDLE)).toBeFalsy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeFalsy();
});

it("Lints JavaScript with rollup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-rollup/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, BUNDLE)).toBeFalsy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeFalsy();
});
