import { test, expect } from "vitest";
import * as testUtils from "../utils.js";

const BUNDLE = "dist/js/myBundle.min.js";
const BUNDLE_MAP = `${BUNDLE}.map`;

test("Compiles JavaScript", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

test("Compiles JavaScript with webpack overrides", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/compiles-merge-webpack-config"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

test("Compiles Generators", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/compiles-generators"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

test("Deduplicates helpers", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/compiles-deduplicates"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

test("Does not transpile on modern browsers", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/no-old-browser"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

test("Compiles JavaScript with externals", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/externals"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

test("Creates profiles", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/profiles"
  );

  const result = await testUtils.run(["run", "default", "--analyze"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle_report.html")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle_stats.json")).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

test("Lints JavaScript with webpack", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, BUNDLE)).toBeFalsy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeFalsy();
});

test("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  // Files aren't generated on failed lint
  expect(testUtils.exists(cwd, BUNDLE)).toBeFalsy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeFalsy();
});

test("Removes unused classes", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-babel-webpack/tree-shaking"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  const content = testUtils.readFile(cwd, BUNDLE);

  expect(content.indexOf("From class A") > -1).toBeTruthy();
  expect(content.indexOf("From class B") > -1).toBeFalsy();
});
