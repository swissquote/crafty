/* global jest, describe, it, expect */

const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

it("Compiles Only with Webpack", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-runner-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/690.myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/690.myBundle.min.js.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/690.myBundle.min.js")
  ).toMatchSnapshot();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-runner-webpack/fails");

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
