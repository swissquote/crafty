/* global describe, it, expect, jest */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");

const testUtils = require("../utils");

// node-forge 0.6.33 doesn't work with jest.
// but selfsigned is fixed on this version
// as we don't use it for now, we can simply mock it
// https://github.com/jfromaniello/selfsigned/issues/16
jest.mock("node-forge");

it("Works with rollup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript-rollup/compiles")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myTSBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myTSBundle.min.js.map")).toBeTruthy();
  expect(
    testUtils.readForSnapshot("dist/js/myTSBundle.min.js")
  ).toMatchSnapshot();
});

it("Deletes rollup uglify plugin using crafty.config.js", () => {
  process.chdir(
    path.join(
      __dirname,
      "../fixtures/crafty-preset-typescript-rollup/compiles-no-uglify"
    )
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  expect(fs.existsSync("dist/js/myTSBundle.min.js")).toBeTruthy();
  expect(fs.existsSync("dist/js/myTSBundle.min.js.map")).toBeTruthy();
  expect(
    testUtils.readForSnapshot("dist/js/myTSBundle.min.js")
  ).toMatchSnapshot();
});

it("Fails gracefully on broken markup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript-rollup/fails")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});

it("Lints TypeScript with rollup", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript-rollup/lints")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["run", "default"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});
