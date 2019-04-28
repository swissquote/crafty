/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");

const testUtils = require("../utils");

const BUNDLE = "dist/js/myBundle.min.js";
const BUNDLE_MAP = `${BUNDLE}.map`;

it("Compiles JavaScript", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/compiles")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync(BUNDLE)).toBeTruthy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeTruthy();

  expect(fs.readFileSync(BUNDLE).toString("utf8")).toMatchSnapshot();
});

it("Compiles Generators", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-babel-webpack/compiles-generators"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync(BUNDLE)).toBeTruthy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeTruthy();

  expect(fs.readFileSync(BUNDLE).toString("utf8")).toMatchSnapshot();
});

it("Deduplicates helpers", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-babel-webpack/compiles-deduplicates"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync(BUNDLE)).toBeTruthy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeTruthy();

  expect(fs.readFileSync(BUNDLE).toString("utf8")).toMatchSnapshot();
});

it("Does not transpile on modern browsers", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-babel-webpack/no-old-browser"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync(BUNDLE)).toBeTruthy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeTruthy();

  expect(fs.readFileSync(BUNDLE).toString("utf8")).toMatchSnapshot();
});

it("Compiles JavaScript with externals", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/externals")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync(BUNDLE)).toBeTruthy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeTruthy();

  expect(fs.readFileSync(BUNDLE).toString("utf8")).toMatchSnapshot();
});

it("Creates profiles", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/profiles")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default", "--profile"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync(BUNDLE)).toBeTruthy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle_report.html")).toBeTruthy();
  expect(fs.existsSync("dist/js/myBundle_stats.json")).toBeTruthy();

  expect(fs.readFileSync(BUNDLE).toString("utf8")).toMatchSnapshot();
});

it("Lints JavaScript with webpack", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/lints")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync(BUNDLE)).toBeFalsy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeFalsy();
});

it("Fails gracefully on broken markup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/fails")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync(BUNDLE)).toBeFalsy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeFalsy();
});

it("Removes unused classes", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-babel-webpack/tree-shaking")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync(BUNDLE)).toBeTruthy();
  expect(fs.existsSync(BUNDLE_MAP)).toBeTruthy();

  const content = fs.readFileSync(BUNDLE).toString("utf8");

  expect(content.indexOf("From class A") > -1).toBeTruthy();
  expect(content.indexOf("From class C") > -1).toBeTruthy();
  expect(content.indexOf("From class D") > -1).toBeFalsy();
  expect(content.indexOf("From class B") > -1).toBeFalsy();
});
