/* global jest, it, expect */

const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

let testIfNotPnp = it;

try {
  require("pnpapi");
  testIfNotPnp = it.skip;
} catch (error) {
  // not in PnP; not a problem
}

it("Succeeds without transpiling", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/succeeds");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
});

it("Creates IDE Integration files", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/ide", [
    "jest.config.js",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
  expect(testUtils.readForSnapshot(cwd, "jest.config.js")).toMatchSnapshot();

  expect(testUtils.readForSnapshot(cwd, ".gitignore")).toMatchSnapshot();
});

it("Creates IDE Integration files with Babel", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/ide-babel", [
    "jest.config.js",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
  expect(testUtils.readForSnapshot(cwd, "jest.config.js")).toMatchSnapshot();
});

testIfNotPnp("Succeeds with typescript", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/typescript");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

it("Succeeds with babel", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/babel");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

it("Fails with babel", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/babel-fails"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);
});

testIfNotPnp("Succeeds with babel and React", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/babel-react"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

it("Succeeds with esm module", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/esm");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

it("Succeeds with esm module and babel", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/esm-babel");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});
