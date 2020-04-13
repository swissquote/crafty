/* global describe, it, expect */
const path = require("path");
const rmfr = require("rmfr");
const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

it("Lints TypeScript using the command", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-typescript/lints"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["jsLint", "js/**/*.ts"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints TypeScript using the command, --preset recommended", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-typescript/lints"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["jsLint", "js/**/*.ts", "--preset", "recommended"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints TypeScript using the command, --preset format", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-typescript/lints"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["jsLint", "js/**/*.ts", "--preset", "format"], cwd);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
});
