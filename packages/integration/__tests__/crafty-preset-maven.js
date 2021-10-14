/* global jest, describe, it, expect */

const path = require("path");
const testUtils = require("../utils");

// Add a high timeout because of https://github.com/facebook/jest/issues/8942
// Tests would be unreliable if they timeout >_<
jest.setTimeout(30000);

it("Fails if no pom is found", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-maven/missing-pom"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall).toContain(
    "Could not define destination using maven, falling back to default."
  );
  expect(result.stdall).toContain("No pom.xml found");
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
});

it("Places files in target of a webapp", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-maven/webapp");

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(
    testUtils.exists(
      cwd,
      "target/my-app-1.0.0-SNAPSHOT/resources/js/myBundle.min.js"
    )
  ).toBeTruthy();
});

it("Reads env. var before pom.xml", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-maven/env-override"
  );

  const result = await testUtils.run(["run", "default"], cwd, {
    env: { TARGET_BASEDIR: path.join(cwd, "target/some_basedir") }
  });

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(
    testUtils.exists(cwd, "target/some_basedir/resources/js/myBundle.min.js")
  ).toBeTruthy();
});

it("Places files in target of a webapp from within a subfolder", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-maven/subfolder/src/main/frontend"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(
    testUtils.exists(
      cwd,
      "../../../target/my-app-1.0.0-SNAPSHOT/resources/js/myBundle.min.js"
    )
  ).toBeTruthy();
});

it("Places files in target of a webjar", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-maven/webjar");

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(
    testUtils.exists(
      cwd,
      "target/classes/META-INF/resources/webjars/js/myBundle.min.js"
    )
  ).toBeTruthy();
});
