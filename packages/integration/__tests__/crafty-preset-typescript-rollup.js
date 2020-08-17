/* global describe, it, expect, jest */

const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

// node-forge 0.6.33 doesn't work with jest.
// but selfsigned is fixed on this version
// as we don't use it for now, we can simply mock it
// https://github.com/jfromaniello/selfsigned/issues/16
jest.mock("node-forge");

it("Works with rollup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeTruthy();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myTSBundle.min.js")
  ).toMatchSnapshot();
});

it("Deletes rollup terser plugin using crafty.config.js", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/compiles-no-terser"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeTruthy();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myTSBundle.min.js")
  ).toMatchSnapshot();
});

it("Keeps imports unresolved for Babel Runtime", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeTruthy();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myTSBundle.min.js")
  ).toMatchSnapshot();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints TypeScript with rollup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
