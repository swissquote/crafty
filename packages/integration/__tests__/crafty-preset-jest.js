/* global describe, it, expect */

const fs = require("fs");
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
