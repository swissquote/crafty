/* global describe, it, expect */

const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");

const testUtils = require("../utils");

it("Lints TypeScript using the command", () => {
  process.chdir(
    path.join(__dirname, "../fixtures/crafty-preset-typescript/lints")
  );
  rimraf.sync("dist");

  const result = testUtils.run(["tsLint", "js/**/*.ts"]);

  expect(result).toMatchSnapshot();

  // Files aren't generated on failed lint
  expect(fs.existsSync("dist/js/myBundle.min.js")).toBeFalsy();
  expect(fs.existsSync("dist/js/myBundle.min.js.map")).toBeFalsy();
});
