/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");

const testUtils = require("../utils");

it("Compiles CSS within webpack", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss-webpack/compiles")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot("dist/js/myBundle.min.js")
  ).toMatchSnapshot();
});

it("Fails gracefully on broken markup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-postcss-webpack/fails")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Compiles CSS within webpack, extracts CSS ('extractCSS' boolean option)", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-postcss-webpack/extract-boolean"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle-default.min.css")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle-default.min.css.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot("dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    fs.readFileSync("dist/js/myBundle-default.min.css").toString("utf8")
  ).toMatchSnapshot();
});

it("Compiles CSS within webpack, extracts CSS ('extractCSS' string option)", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-postcss-webpack/extract-string"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle-string.min.css")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle-string.min.css.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot("dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    fs.readFileSync("dist/js/myBundle-string.min.css").toString("utf8")
  ).toMatchSnapshot();
});

it("Compiles CSS within webpack, extracts CSS ('extractCSS' object option)", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-postcss-webpack/extract-object"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle-object.min.css")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle-object.min.css.map")).toBeTruthy();

  expect(
    testUtils.readForSnapshot("dist/js/myBundle.min.js")
  ).toMatchSnapshot();
  expect(
    fs.readFileSync("dist/js/myBundle-object.min.css").toString("utf8")
  ).toMatchSnapshot();
});
