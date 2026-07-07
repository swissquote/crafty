import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import getCommands from "@swissquote/crafty/src/commands/index";
import * as testUtils from "../utils";

const getCrafty = configuration.getCrafty;

const PRESET_OXLINT = "@swissquote/crafty-preset-oxlint";
const PRESET_OXFMT = "@swissquote/crafty-preset-oxfmt";

test("Loads crafty-preset-oxlint, registers the oxlint command and pulls in oxfmt", async () => {
  const crafty = await getCrafty([PRESET_OXLINT], {});

  const loaded = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loaded).toContain(PRESET_OXLINT);
  expect(loaded).toContain(PRESET_OXFMT);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("oxlint");
  expect(Object.keys(commands)).toContain("oxfmt");
});

test("ESLint and Prettier stand down when oxlint/oxfmt are loaded, even under TypeScript", async () => {
  const crafty = await getCrafty(
    [PRESET_OXLINT, "@swissquote/crafty-preset-typescript"],
    {}
  );

  const loaded = crafty.loadedPresets.map(preset => preset.presetName);
  // TypeScript pulls in ESLint, oxlint pulls in oxfmt
  expect(loaded).toContain("@swissquote/crafty-preset-eslint");
  expect(loaded).toContain("@swissquote/crafty-preset-prettier");

  const find = name =>
    crafty.loadedPresets.find(preset => preset.presetName === name);

  // ESLint and Prettier IDE configs stand down
  expect(find("@swissquote/crafty-preset-eslint").run("ide", crafty)).toEqual(
    {}
  );
  expect(find("@swissquote/crafty-preset-prettier").run("ide", crafty)).toEqual(
    {}
  );

  // oxlint and oxfmt generate their configs instead
  expect(Object.keys(find(PRESET_OXLINT).run("ide", crafty))).toContain(
    ".oxlintrc.json"
  );
  expect(Object.keys(find(PRESET_OXFMT).run("ide", crafty))).toContain(
    ".oxfmtrc.json"
  );
});

test("oxlint passes on clean code", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-oxlint/lints", [
    "dist",
    "reports"
  ]);

  const result = await testUtils.run(["oxlint", "js"], cwd);

  expect(result.status).toBe(0);
});

test("oxlint fails on a lint error and writes a SARIF report", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-oxlint/lints-error",
    ["dist", "reports"]
  );

  const result = await testUtils.run(["oxlint", "js"], cwd);

  expect(result.status).not.toBe(0);
  expect(result.stdall).toContain("no-debugger");
  expect(testUtils.exists(cwd, "reports/oxlint")).toBeTruthy();
});
