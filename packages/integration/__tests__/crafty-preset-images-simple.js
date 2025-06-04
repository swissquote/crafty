import { test, expect } from "vitest";
import fs from "fs";
import path from "path";
import configuration from "@swissquote/crafty/src/configuration";
import * as testUtils from "../utils.js";

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-images-simple and does not register gulp tasks", async () => {
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-images-simple"],
    {}
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes("@swissquote/crafty-preset-images-simple")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

test("Fails if both crafty-preset-images and crafty-preset-images-simple are loaded", async () => {
  const crafty = await getCrafty(
    [
      "@swissquote/crafty-preset-images",
      "@swissquote/crafty-preset-images-simple",
      "@swissquote/crafty-runner-gulp"
    ],
    {}
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes("@swissquote/crafty-preset-images")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-preset-images-simple")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();

  expect(() => crafty.createTasks()).toThrow(/a task with this name already exists/);
});

test("Loads crafty-preset-images-simple, crafty-runner-gulp and registers gulp task", async () => {
  const crafty = await getCrafty(
    [
      "@swissquote/crafty-preset-images-simple",
      "@swissquote/crafty-runner-gulp"
    ],
    {}
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes("@swissquote/crafty-preset-images-simple")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "images",
    "default"
  ]);
});

test("Copies and compresses images", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-images-simple");

  const result = await testUtils.run(["run", "images"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/images/batman.svg")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/images/somedir/cute-cats-2.jpg")).toBeTruthy();

  expect(
    fs.statSync(path.join(cwd, "dist/images/batman.svg")).size
  ).toEqual(
    fs.statSync(path.join(cwd, "images/batman.svg")).size
  );
  expect(
    fs.statSync(path.join(cwd, "dist/images/somedir/cute-cats-2.jpg")).size
  ).toEqual(
    fs.statSync(path.join(cwd, "images/somedir/cute-cats-2.jpg")).size
  );
});
