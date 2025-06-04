import { test, expect } from "vitest";
import * as testUtils from "../utils.js";

test("Succeeds without transpiling", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/succeeds");

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("src/__tests__/math.js")).toBeTruthy();
  expect(result.stdall.includes("src/__tests__/math-advanced.js")).toBeTruthy();
});

test("Succeeds without transpiling, selects test", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/succeeds");

  const result = await testUtils.run(
    ["test", "__tests__/math-advanced.js"],
    cwd
  );

  expect(result.stdall.includes("src/__tests__/math.js")).toBeFalsy();
  expect(result.stdall.includes("src/__tests__/math-advanced.js")).toBeTruthy();

  expect(result).toMatchSnapshot();
});

test("Shows configuration", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/succeeds");

  const result = await testUtils.run(["test", "--showConfig"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("moduleNameMapper")).toBeTruthy();
  expect(result.stdall.includes("testRegex")).toBeTruthy();
});

test("Creates IDE Integration files", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/ide", [
    "jest.config.js",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
  expect(testUtils.readForSnapshot(cwd, "jest.config.mjs")).toMatchSnapshot();

  expect(testUtils.exists(cwd, ".gitignore")).toBeFalsy();
});

test("Creates IDE Integration files with Babel", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/ide-babel", [
    "jest.config.mjs",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
  expect(testUtils.readForSnapshot(cwd, "jest.config.mjs")).toMatchSnapshot();
});

test("Succeeds with typescript", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/typescript");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

test("Succeeds with typescript modules", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/typescript-modules"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

test("Succeeds with typescript modules in esm mode", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/typescript-modules-mjs"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

test("Succeeds with babel", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/babel");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

test("Fails with babel", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/babel-fails"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);
});

test("Succeeds with babel and React", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/babel-react"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

test("Succeeds with esm module", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/esm");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

test("Succeeds with esm dependency", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/esm-dependency"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});

test("Succeeds with esm dependency and babel", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/esm-babel");

  const result = await testUtils.run(["test"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
});
