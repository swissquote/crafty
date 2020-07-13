/* global jest, describe, it, expect */

const path = require("path");
const rmfr = require("rmfr");
const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

it("Fails if no pom is found", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-maven/missing-pom"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
});

it("Places files in target of a webapp", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-maven/webapp");
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(
    testUtils.exists(
      cwd,
      "target/my-app-1.0.0-SNAPSHOT/resources/js/myBundle.min.js"
    )
  ).toBeTruthy();
});

it("Reads env. var before pom.xml", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-maven/env-override"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd, {
    env: { TARGET_BASEDIR: path.join(cwd, "target/some_basedir") }
  });

  expect(result).toMatchSnapshot();

  expect(
    testUtils.exists(cwd, "target/some_basedir/resources/js/myBundle.min.js")
  ).toBeTruthy();
});

it("Places files in target of a webapp from within a subfolder", async () => {
  const cwd = path.join(
    __dirname,
    "../fixtures/crafty-preset-maven/subfolder/src/main/frontend"
  );
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(
    testUtils.exists(
      cwd,
      "../../../target/my-app-1.0.0-SNAPSHOT/resources/js/myBundle.min.js"
    )
  ).toBeTruthy();
});

it("Places files in target of a webjar", async () => {
  const cwd = path.join(__dirname, "../fixtures/crafty-preset-maven/webjar");
  await rmfr(path.join(cwd, "dist"));

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();

  expect(
    testUtils.exists(
      cwd,
      "target/classes/META-INF/resources/webjars/js/myBundle.min.js"
    )
  ).toBeTruthy();
});
