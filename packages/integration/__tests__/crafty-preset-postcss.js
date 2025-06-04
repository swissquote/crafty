import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import getCommands from "@swissquote/crafty/src/commands/index.js";
import * as testUtils from "../utils.js";

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-postcss and does not register gulp tasks", async () => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-postcss"], {});

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes("@swissquote/crafty-preset-postcss")).toBeTruthy();

  const commands = getCommands(crafty);
  expect(Object.keys(commands).includes("cssLint")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

test("Lints with the command", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss/no-bundle"
  );

  const result = await testUtils.run(["cssLint", "css/*.scss"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(2);

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

test("Lints with the command in legacy mode", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss/no-bundle"
  );

  const result = await testUtils.run(
    ["cssLint", "css/*.scss", "--preset", "legacy"],
    cwd
  );

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(2);

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

test("Lints with the command with custom config", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss/no-bundle"
  );

  const result = await testUtils.run(
    ["cssLint", "css/*.scss", "--config", "stylelint.json"],
    cwd
  );

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(2);

  expect(testUtils.exists(cwd, "dist")).toBeFalsy();
});

test("Creates IDE Integration files", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-postcss/ide", [
    "stylelint.config.mjs",
    "prettier.config.mjs",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);
  expect(testUtils.readForSnapshot(cwd, "stylelint.config.mjs")).toMatchSnapshot();

  expect(testUtils.readForSnapshot(cwd, "prettier.config.mjs")).toMatchSnapshot();

  expect(testUtils.exists(cwd, ".gitignore")).toBeFalsy();
});
