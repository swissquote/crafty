import { test } from "node:test";
import assert from "node:assert";

import { configs } from "../index.js";

test("exposes the three Swissquote flavors", () => {
  assert.deepStrictEqual(Object.keys(configs).sort(), [
    "legacy",
    "node",
    "recommended"
  ]);
});

test("every flavor is a valid .oxlintrc.json-shaped object", () => {
  for (const [name, config] of Object.entries(configs)) {
    assert.ok(
      Array.isArray(config.plugins),
      `${name}.plugins should be an array`
    );
    assert.ok(
      typeof config.categories === "object" && config.categories !== null,
      `${name}.categories should be an object`
    );
    assert.ok(
      typeof config.rules === "object" && config.rules !== null,
      `${name}.rules should be an object`
    );
    // Severities must be valid oxlint/eslint values
    for (const [rule, value] of Object.entries(config.rules)) {
      const severity = Array.isArray(value) ? value[0] : value;
      assert.ok(
        ["off", "warn", "error", "allow", "deny"].includes(severity),
        `${name}.rules["${rule}"] has invalid severity "${severity}"`
      );
    }
    // The whole config must be JSON-serializable (it is written to disk as JSON)
    assert.doesNotThrow(() => JSON.stringify(config));
  }
});

test("legacy flavor does not enforce ES2015+ syntax", () => {
  assert.strictEqual(configs.legacy.rules["no-var"], "off");
  assert.strictEqual(configs.legacy.rules["prefer-const"], "off");
});

test("recommended enables the React plugin, node does not", () => {
  assert.ok(configs.recommended.plugins.includes("react"));
  assert.ok(!configs.node.plugins.includes("react"));
  assert.ok(configs.node.plugins.includes("node"));
});
