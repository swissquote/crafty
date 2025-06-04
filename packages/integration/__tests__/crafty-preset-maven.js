import { test, expect } from "vitest";
import path from "path";
import * as testUtils from "../utils.js";

test("Fails if no pom is found", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-maven/missing-pom"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result.status).toBe(0);
  expect(
    result.stdall.includes(
      "Could not define destination using maven, falling back to default."
    )
  ).toBeTruthy();
  expect(result.stdall.includes("No pom.xml found")).toBeTruthy();
  expect(result).toMatchSnapshot();

  expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
});

test("Places files in target of a webapp", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-maven/webapp", [
    "target"
  ]);

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

test("Reads env. var before pom.xml", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-maven/env-override",
    ["target"]
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

test(
  "Places files in target of a webapp from within a subfolder",
  async () => {
    await testUtils.getCleanFixtures("crafty-preset-maven/subfolder", [
      "target"
    ]);

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
  }
);

test("Places files in target of a webjar", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-maven/webjar", [
    "target"
  ]);

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
