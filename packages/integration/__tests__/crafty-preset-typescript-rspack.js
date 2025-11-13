import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";
import configuration from "@swissquote/crafty/src/configuration";
import * as testUtils from "../utils";

const getCrafty = configuration.getCrafty;

describe("crafty-preset-typescript-rspack", () => {
  test("Loads crafty-preset-typescript and does not register rspack tasks", async () => {
    const crafty = await getCrafty(
      ["@swissquote/crafty-preset-typescript"],
      {}
    );

    const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
    expect(
      loadedPresets.includes("@swissquote/crafty-preset-typescript")
    ).toBeTruthy();

    crafty.createTasks();
    expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
  });

  test("Loads crafty-preset-typescript, crafty-runner-rspack and registers rspack task", async () => {
    const config = { js: { myBundle: { source: "css/style.scss" } } };
    const crafty = await getCrafty(
      [
        "@swissquote/crafty-preset-typescript",
        "@swissquote/crafty-runner-rspack"
      ],
      config
    );

    const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
    expect(
      loadedPresets.includes("@swissquote/crafty-preset-typescript")
    ).toBeTruthy();
    expect(
      loadedPresets.includes("@swissquote/crafty-runner-rspack")
    ).toBeTruthy();

    crafty.createTasks();
    expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
      "js_myBundle",
      "js",
      "default"
    ]);
  });

  test("Compiles TypeScript", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/compiles"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/222.myBundle.min.js")).toBeTruthy();
    expect(
      testUtils.exists(cwd, "dist/js/222.myBundle.min.js.map")
    ).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/js/SomeLibrary.d.ts")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/js/Component.d.ts")).toBeTruthy();

    expect(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/222.myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/js/SomeLibrary.d.ts")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/js/Component.d.ts")
    ).toMatchSnapshot();
  });

  test("Compiles TypeScript, alternate conf", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/compiles-alternate-conf"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/222.myBundle.min.js")).toBeTruthy();
    expect(
      testUtils.exists(cwd, "dist/js/222.myBundle.min.js.map")
    ).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/js/SomeLibrary.d.ts")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/js/Component.d.ts")).toBeTruthy();

    expect(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/222.myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/js/SomeLibrary.d.ts")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/js/Component.d.ts")
    ).toMatchSnapshot();
  });

  test("Compiles TypeScript - fork checker", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/compiles-forked"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
    expect(
      testUtils.exists(cwd, "dist/js/someLibrary.myBundle.min.js")
    ).toBeTruthy();
    expect(
      testUtils.exists(cwd, "dist/js/someLibrary.myBundle.min.js.map")
    ).toBeTruthy();

    expect(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/someLibrary.myBundle.min.js")
    ).toMatchSnapshot();
  });

  test("Compiles TypeScript - custom paths", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/compiles-paths"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/222.myBundle.min.js")).toBeTruthy();
    expect(
      testUtils.exists(cwd, "dist/js/222.myBundle.min.js.map")
    ).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/js/SomeLibrary.d.ts")).toBeTruthy();
    expect(
      testUtils.exists(cwd, "dist/js/js/components/Calculator.d.ts")
    ).toBeTruthy();

    expect(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/222.myBundle.min.js")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/js/SomeLibrary.d.ts")
    ).toMatchSnapshot();
    expect(
      testUtils.readForSnapshot(cwd, "dist/js/js/components/Calculator.d.ts")
    ).toMatchSnapshot();
  });

  test("Lints TypeScript with rspack", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/lints"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeFalsy();
  });

  test("Fails gracefully on broken markup", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/fails"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    // Files aren't generated on failed lint
    expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeFalsy();
  });

  test("Fails gracefully on invalid TS", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/invalid"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    // Files aren't generated on failed types
    expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeFalsy();
  });

  test("Fails gracefully on invalid TS - fork checker", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/invalid-forked"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(1);

    // Files aren't generated on failed types
    expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js")).toBeFalsy();
    expect(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map")).toBeFalsy();
  });

  test("Removes unused classes", async () => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript-rspack/tree-shaking"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    expect(result).toMatchSnapshot();
    expect(result.status).toBe(0);

    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js")).toBeTruthy();
    expect(testUtils.exists(cwd, "dist/js/myBundle.min.js.map")).toBeTruthy();

    const content = fs
      .readFileSync(path.join(cwd, "dist/js/myBundle.min.js"))
      .toString("utf8");

    expect(content.indexOf("From class A") > -1).toBeTruthy();
    expect(content.indexOf("From class B") > -1).toBeFalsy();
  });
});
