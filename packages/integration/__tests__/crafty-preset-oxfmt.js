import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import getCommands from "@swissquote/crafty/src/commands/index";
import * as testUtils from "../utils";

const getCrafty = configuration.getCrafty;

const PRESET_OXFMT = "@swissquote/crafty-preset-oxfmt";

test("Loads crafty-preset-oxfmt and registers the oxfmt command", async () => {
  const crafty = await getCrafty([PRESET_OXFMT], {});

  const loaded = crafty.loadedPresets.map(preset => preset.presetName);
  expect(loaded).toContain(PRESET_OXFMT);

  const commands = getCommands(crafty);
  expect(Object.keys(commands)).toContain("oxfmt");
});

test("oxfmt --check fails on unformatted code", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-oxfmt/format");

  const result = await testUtils.run(["oxfmt", "--check", "js"], cwd);

  expect(result.status).not.toBe(0);
});

test("oxfmt formats in place and then --check passes", async () => {
  const { cwd, cleanup } = await testUtils.getIsolatedFixtures(
    "crafty-preset-oxfmt/format"
  );

  try {
    const write = await testUtils.run(["oxfmt", "js"], cwd);
    expect(write.status).toBe(0);

    const check = await testUtils.run(["oxfmt", "--check", "js"], cwd);
    expect(check.status).toBe(0);
  } finally {
    await cleanup();
  }
});
