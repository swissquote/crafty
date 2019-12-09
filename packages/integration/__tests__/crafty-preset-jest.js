/* global describe, it, expect */

const path = require("path");
const rmfr = require("rmfr");
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
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-jest/succeeds");
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
});

it("Creates IDE Integration files", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-jest/ide");
  await rmfr(path.join(cwd, "jest.config.js"));
  await rmfr(path.join(cwd, ".gitignore"));

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();
  expect(testUtils.readForSnapshot(cwd, "jest.config.js")).toMatchSnapshot();

  expect(testUtils.readForSnapshot(cwd, ".gitignore")).toMatchSnapshot();
});

it("Creates IDE Integration files with Babel", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-jest/ide-babel");
  await rmfr(path.join(cwd, "jest.config.js"));
  await rmfr(path.join(cwd, ".gitignore"));

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();
  expect(testUtils.readForSnapshot(cwd, "jest.config.js")).toMatchSnapshot();
});

testIfNotPnp("Succeeds with typescript", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-jest/typescript");
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
});

it("Succeeds with babel", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-jest/babel");
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
});

it("Fails with babel", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-jest/babel-fails");
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
});

testIfNotPnp("Succeeds with babel and React", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-jest/babel-react"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
});

it("Succeeds with esm module", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-jest/esm");
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
});

it("Succeeds with esm module and babel", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-jest/esm-babel");
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
});
