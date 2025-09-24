import { describe, test, expect } from "vitest";
import * as testUtils from "../utils.js";

describe("crafty-preset-typescript", () => {
  test("Lints TypeScript using the command", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/lints"
    );

    const result = await testUtils.run(["jsLint", "js/**/*.ts"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  });

  test("Lints TypeScript using the command, --preset recommended, --preset node", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/lints"
    );

    const result = await testUtils.run(
      ["jsLint", "js/**/*.ts", "--preset", "recommended", "--preset", "node"],
      cwd
    );

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  });

  test("Lints TypeScript using the command, --preset recommended", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/lints"
    );

    const result = await testUtils.run(
      ["jsLint", "js/**/*.ts", "--preset", "recommended"],
      cwd
    );

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  });

  test("Lints TypeScript using the command, --preset format", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/lints"
    );

    const result = await testUtils.run(
      ["jsLint", "js/**/*.ts", "--preset", "format"],
      cwd
    );

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  });

  test("Tests Syntax using Prettier 1", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/test-ts-syntax_prettier1"
    );

    const result = await testUtils.run(["run"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/TS_4_0.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/webpack.min.js")).toBeTruthy();
  });

  test("Tests Syntax using Prettier 2", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/test-ts-syntax_prettier2"
    );

    const result = await testUtils.run(["run"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/TS_4_0.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/webpack.min.js")).toBeTruthy();
  });

  test("Tests Syntax using Prettier 3", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/test-ts-syntax_prettier3"
    );

    const result = await testUtils.run(["run"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/TS_4_0.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/webpack.min.js")).toBeTruthy();
  });
});
