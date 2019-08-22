/* global describe, it, expect */

const path = require("path");

const rimraf = require("rimraf");

const testUtils = require("../utils");

let testIfNotPnp = it;

try {
  require("pnpapi");
  testIfNotPnp = it.skip;
} catch (error) {
  // not in PnP; not a problem
}

it("Succeeds without transpiling", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-jest/succeeds")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});

it("Creates IDE Integration files", () => {
  process.chdir(path.join(__dirname, "../fixtures/crafty-preset-jest/ide"));
  rimraf.sync("jest.config.js");
  rimraf.sync(".gitignore");

  const result = testUtils.run(["ide"]);

  expect(result).toMatchSnapshot();
  expect(testUtils.readForSnapshot("jest.config.js")).toMatchSnapshot();

  expect(testUtils.readForSnapshot(".gitignore")).toMatchSnapshot();
});

it("Creates IDE Integration files with Babel", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-jest/ide-babel")
  );
  rimraf.sync("jest.config.js");
  rimraf.sync(".gitignore");

  const result = testUtils.run(["ide"]);

  expect(result).toMatchSnapshot();
  expect(testUtils.readForSnapshot("jest.config.js")).toMatchSnapshot();
});

testIfNotPnp("Succeeds with typescript", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-jest/typescript")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});

it("Succeeds with babel", () => {
  process.chdir(path.join(__dirname, "../fixtures/crafty-preset-jest/babel"));
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});

testIfNotPnp("Succeeds with babel and React", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-jest/babel-react")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});

it("Succeeds with esm module", () => {
  process.chdir(path.join(__dirname, "../fixtures/crafty-preset-jest/esm"));
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});

it("Succeeds with esm module and babel", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-jest/esm-babel")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});
