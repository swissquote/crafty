import { test, expect } from "vitest";
import configuration from "@swissquote/crafty/src/configuration";
import eslintPreset from "@swissquote/crafty-preset-eslint";

const getCrafty = configuration.getCrafty;

const PRESET_ESLINT = "@swissquote/crafty-preset-eslint";
const PRESET_OXLINT = "@swissquote/crafty-preset-oxlint";
const PRESET_OXFMT = "@swissquote/crafty-preset-oxfmt";

function hasPrettierRuleOff(configs) {
  return configs.some(
    config => config.rules && config.rules["prettier/prettier"] === "off"
  );
}

function formattingMode(configs) {
  const withMode = configs.filter(
    config => config.settings && config.settings["formatting/mode"]
  );
  return withMode.length > 0
    ? withMode[withMode.length - 1].settings["formatting/mode"]
    : undefined;
}

test("ESLint + Prettier: single providers are auto-selected, formatter defaults to prettier:1", async () => {
  const crafty = await getCrafty([PRESET_ESLINT], {});

  expect(crafty.getActiveLinter()).toBe("eslint");
  expect(crafty.getActiveFormatter()).toBe("prettier:1");
  expect(crafty.getFormatterFamily()).toBe("prettier");
});

test("formatter: 'prettier:2' selects the version, and the legacy setting still works", async () => {
  const viaFormatter = await getCrafty([PRESET_ESLINT], {
    formatter: "prettier:2"
  });
  expect(viaFormatter.getActiveFormatter()).toBe("prettier:2");
  expect(formattingMode(await eslintPreset.toESLintConfig(viaFormatter))).toBe(
    "prettier:2"
  );

  // Legacy alias: setting it directly in eslint.settings keeps working
  const viaLegacy = await getCrafty([PRESET_ESLINT], {
    eslint: { settings: { "formatting/mode": "prettier:2" } }
  });
  expect(viaLegacy.getActiveFormatter()).toBe("prettier:2");
  expect(formattingMode(await eslintPreset.toESLintConfig(viaLegacy))).toBe(
    "prettier:2"
  );
});

test("oxlint/oxfmt win over ESLint/Prettier by precedence when both are loaded", async () => {
  const crafty = await getCrafty([PRESET_OXLINT, PRESET_ESLINT], {});

  expect(crafty.getActiveLinter()).toBe("oxlint");
  expect(crafty.getActiveFormatter()).toBe("oxfmt");
  expect(crafty.isActiveLinter("eslint")).toBe(false);
  expect(crafty.isActiveFormatter("prettier")).toBe(false);
});

test("explicit linter/formatter overrides precedence", async () => {
  const crafty = await getCrafty([PRESET_OXLINT, PRESET_ESLINT], {
    linter: "eslint",
    formatter: "prettier:3"
  });

  expect(crafty.getActiveLinter()).toBe("eslint");
  expect(crafty.getActiveFormatter()).toBe("prettier:3");
});

test("ESLint + oxfmt: the prettier/prettier rule is turned off so oxfmt owns formatting", async () => {
  const crafty = await getCrafty([PRESET_ESLINT, PRESET_OXFMT], {
    formatter: "oxfmt"
  });

  expect(crafty.getActiveLinter()).toBe("eslint");
  expect(crafty.isActiveFormatter("oxfmt")).toBe(true);

  const configs = await eslintPreset.toESLintConfig(crafty);
  expect(hasPrettierRuleOff(configs)).toBe(true);
  expect(formattingMode(configs)).toBeUndefined();
});

test("configuring an unavailable formatter throws a helpful error", async () => {
  const crafty = await getCrafty([PRESET_ESLINT], { formatter: "oxfmt" });

  expect(() => crafty.getActiveFormatter()).toThrow(/not provided/u);
});
