/* global jest, describe, it, expect */

const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

it("Compiles JavaScript with rollup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-rollup/compiles"
  );
  );


  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-rollup/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints JavaScript with rollup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-rollup/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
