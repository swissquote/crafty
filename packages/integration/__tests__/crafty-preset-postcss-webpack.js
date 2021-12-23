/* global jest, it, expect */

const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

it("Compiles CSS within webpack", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Compiles CSS within webpack, extracts CSS ('extractCSS' boolean option)", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/extract-boolean"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-default.min.css")
  ).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-default.min.css.map")
  ).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    testUtils.readFile(cwd, "dist/js/myBundle-default.min.css")
  ).toMatchSnapshot();
});

it("Compiles CSS within webpack, extracts CSS ('extractCSS' string option)", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/extract-string"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle-string.min.css")).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-string.min.css.map")
  ).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    testUtils.readFile(cwd, "dist/js/myBundle-string.min.css")
  ).toMatchSnapshot();
});

it("Compiles CSS within webpack, extracts CSS ('extractCSS' object option)", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/extract-object"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle-object.min.css")).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-object.min.css.map")
  ).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    testUtils.readFile(cwd, "dist/js/myBundle-object.min.css")
  ).toMatchSnapshot();
});
