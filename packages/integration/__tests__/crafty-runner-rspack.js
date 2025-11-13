import { describe, test, expect } from "vitest";
import * as testUtils from "../utils";

describe("crafty-runner-rspack", () => {
  test("Compiles Only with Rspack", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-runner-rspack/compiles"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/170.myBundle.min.js")).toBeTruthy();
    expect(
      testUtils.exists(cwd, "dist/js/170.myBundle.min.js.map")
    ).toBeTruthy();

    expect(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/170.myBundle.min.js")
    ).toMatchSnapshot();
  });

  test("Fails gracefully on broken markup", async () => {
    const cwd = await testUtils.getCleanFixtures("crafty-runner-rspack/fails");

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  });
});
