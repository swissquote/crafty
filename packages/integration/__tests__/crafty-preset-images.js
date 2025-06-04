import { test, expect } from "vitest";
import fs from "fs";
import path from "path";
import configuration from "@swissquote/crafty/src/configuration";
import * as testUtils from "../utils.js";

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-images and does not register gulp tasks", async () => {
  const crafty = await getCrafty(["@swissquote/crafty-preset-images"], {});

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes("@swissquote/crafty-preset-images")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([]);
});

test("Loads crafty-preset-images, crafty-runner-gulp and registers gulp task", async () => {
  const crafty = await getCrafty(
    ["@swissquote/crafty-preset-images", "@swissquote/crafty-runner-gulp"],
    {}
  );

  const loadedPresets = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loadedPresets.includes("@swissquote/crafty-preset-images")).toBeTruthy();
  expect(loadedPresets.includes("@swissquote/crafty-runner-gulp")).toBeTruthy();

  crafty.createTasks();
  expect(Object.keys(crafty.undertaker._registry.tasks())).toEqual([
    "images_all",
    "images_svg",
    "images",
    "default"
  ]);
});

test("Copies and compresses images", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-images");

  const result = await testUtils.run(["run", "images"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, "dist/images/batman.svg")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/images/somedir/cute-cats-2.jpg")).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/images/notcopied.txt")).toBeFalsy();

  expect(
    fs.statSync(path.join(cwd, "dist/images/batman.svg")).size
  ).toBeLessThan(fs.statSync(path.join(cwd, "images/batman.svg")).size);
  expect(
    fs.statSync(path.join(cwd, "dist/images/somedir/cute-cats-2.jpg")).size
  ).toBeLessThan(fs.statSync(path.join(cwd, "images/somedir/cute-cats-2.jpg")).size);
});
