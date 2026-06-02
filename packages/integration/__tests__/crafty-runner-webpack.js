import { describe, test, expect } from "vitest";
import fs from "fs";
import path from "path";
import * as testUtils from "../utils";

const unexpectedErrorPattern = /Error(?!.*ExperimentalWarning)/;

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

  test("Starts and rebuilds in watch mode", async () => {
    const fixture = await testUtils.getIsolatedFixtures(
      "crafty-runner-webpack/compiles-watch"
    );
    const cwd = fixture.cwd;
    const watch = testUtils.startWatch(["watch"], cwd);
    const outputFile = "dist/js/myBundle.min.js";
    const someLibraryPath = path.join(cwd, "js", "SomeLibrary.js");
    const originalSource = await fs.promises.readFile(someLibraryPath, "utf8");
    let result;

    try {
      const initialOutput = await testUtils.waitFor(async () => {
        const output = watch.getStdall();

        if (watch.child.exitCode !== null) {
          throw new Error(
            `crafty watch exited before the initial compilation completed:\n${output}`
          );
        }

        if (unexpectedErrorPattern.test(output)) {
          throw new Error(
            `crafty watch printed an unexpected error during startup:\n${output}`
          );
        }

        return output.includes("Compiled successfully!") ? output : false;
      }, "the initial watch output");

      expect(initialOutput).toContain("Compiled successfully!");

      const initialChunk = await testUtils.waitFor(async () => {
        if (!testUtils.exists(cwd, outputFile)) return false;
        const chunk = testUtils.readForSnapshot(cwd, outputFile);
        return chunk.includes('"hello"') ? chunk : false;
      }, "the initial watch build");

      expect(initialChunk).toContain('"hello"');

      await fs.promises.writeFile(
        someLibraryPath,
        originalSource.replace('"hello"', '"world"')
      );

      const rebuiltChunk = await testUtils.waitFor(async () => {
        if (watch.child.exitCode !== null) {
          throw new Error(
            `crafty watch exited before rebuilding after a source change:\n${watch.getStdall()}`
          );
        }
        const chunk = testUtils.readForSnapshot(cwd, outputFile);
        return chunk.includes('"world"') ? chunk : false;
      }, "the rebuilt watch bundle");

      expect(rebuiltChunk).toContain('"world"');
      expect(rebuiltChunk).not.toEqual(initialChunk);
      result = await watch.stop();
    } finally {
      await fs.promises.writeFile(someLibraryPath, originalSource);
      if (!result) result = await watch.stop();
      await fixture.cleanup();
    }

    expect(result.status).toBeNull();
    expect(result.stdall).toContain("Compiled successfully!");
    expect(result.stdall).not.toMatch(unexpectedErrorPattern);
  });
});
