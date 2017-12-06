/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");

const testUtils = require("../utils");

it("Compiles JavaScript", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/compiles")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeTruthy();

  expect(
    fs.readFileSync("dist/js/myBundle.min.js").toString("utf8")
  ).toMatchSnapshot();
});

it("Lints JavaScript with webpack", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/lints")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Fails gracefully on broken markup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/fails")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Removes unused classes", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/tree-shaking")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeTruthy();

  const content = fs.readFileSync("dist/js/myBundle.min.js").toString("utf8");

  expect(content.indexOf("From class A") > -1).toBeTruthy();
  expect(content.indexOf("From class C") > -1).toBeTruthy();
  expect(content.indexOf("From class D") > -1).toBeFalsy();
  expect(content.indexOf("From class B") > -1).toBeFalsy();
});
