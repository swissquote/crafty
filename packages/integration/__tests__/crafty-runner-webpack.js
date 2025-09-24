import { describe, test, expect } from "vitest";
import * as testUtils from "../utils";

describe("crafty-runner-webpack", () => {
  test("Compiles Only with Webpack", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-runner-webpack/compiles"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/913.myBundle.min.js")).toBeTruthy();
    expect(
      testUtils.exists(cwd, "dist/js/913.myBundle.min.js.map")
    ).toBeTruthy();

    expect(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/913.myBundle.min.js")
    ).toMatchSnapshot();
  });

  test("Fails gracefully on broken markup", async () => {
    const cwd = await testUtils.getCleanFixtures("crafty-runner-webpack/fails");

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  });
});
