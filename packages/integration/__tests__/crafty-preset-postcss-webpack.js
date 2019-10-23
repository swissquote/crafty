/* global describe, it, expect */

const path = require("path");
const rmfr = require("rmfr");
const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

it("Compiles CSS within webpack", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-webpack/compiles"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
  ).toMatchSnapshot();
});

it("Fails gracefully on broken markup", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-webpack/fails"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Compiles CSS within webpack, extracts CSS ('extractCSS' boolean option)", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-webpack/extract-boolean"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

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
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-webpack/extract-string"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

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
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-postcss-webpack/extract-object"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

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
