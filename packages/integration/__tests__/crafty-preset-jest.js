/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");

const testUtils = require("../utils");

it("Succeeds without transpiling", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-jest/succeeds")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});

it("Succeeds with typescript", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-jest/typescript")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});

it("Succeeds with babel", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-jest/babel")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["test"]);

  expect(result).toMatchSnapshot();
});