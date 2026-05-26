import { test } from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "expect";
import postcss from "postcss";

import plugin from "../index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function fixturePath(name) {
  return join(__dirname, "fixtures", `${name}.css`);
}

function readFixture(name) {
  return readFileSync(fixturePath(name), "utf8");
}

function testFixture(name, pluginOpts = {}, postcssOpts = {}) {
  let expectedWarnings = 0;
  let fixtureName = name;
  let fixtureExpect = `${name}.expect`;

  if (typeof name !== "string") {
    fixtureName = name.input;
    fixtureExpect = name.output;

    if (name.warnings) {
      expectedWarnings = name.warnings;
    }
  }

  postcssOpts.from = fixturePath(fixtureName);
  let expected = readFixture(fixtureExpect);
  return postcss([plugin(pluginOpts)])
    .process(readFixture(fixtureName), postcssOpts)
    .then((result) => {
      expect(result.css).toBe(expected);
      expect(result.warnings().length).toBe(expectedWarnings);
    });
}

test("supports very basic usage", () => {
  return testFixture("very-basic");
});

test("works with spec examples", () => {
  return testFixture("spec-example");
});

test("supports basic usage", () => {
  return testFixture("basic");
});

test("ignores w3c color functions", () => {
  return testFixture("w3c-color");
});

test("supports { stringifier } usage", () => {
  return testFixture(
    { input: "basic", output: "basic.colors.expect" },
    {
      stringifier: (color) => color.toString(),
    }
  );
});

test("supports { transformVars: false } usage", async () => {
  await expect(
    () =>
      testFixture("basic", {
        transformVars: false,
      })
  ).rejects.toThrow(/Expected a color/);
});

test("supports { unresolved } usage", () => {
  return testFixture(
    { input: "warn", output: "warn", warnings: 43 },
    { unresolved: "warn" }
  );
});

test("supports hex usage", () => {
  return testFixture("hex");
});

test('supports { importFrom: "test/import-root.css" } usage', () => {
  return testFixture("import", {
    importFrom: "tests/fixtures/import-root.css",
  });
});

test('supports { importFrom: ["test/import-root.css"] } usage', () => {
  return testFixture("import", {
    importFrom: ["tests/fixtures/import-root.css"],
  });
});

test('supports { importFrom: [["css", "test/import-root.css" ]] } usage', () => {
  return testFixture("import", {
    importFrom: { from: "tests/fixtures/import-root.css", type: "css" },
  });
});

test('supports { importFrom: "test/import-root.js" } usage', () => {
  return testFixture("import", {
    importFrom: "tests/fixtures/import-root.js",
  });
});

test('supports { importFrom: "test/import-root.json" } usage', () => {
  return testFixture("import", {
    importFrom: "tests/fixtures/import-root.json",
  });
});

test("supports { importFrom: { customProperties: {} } } usage", () => {
  return testFixture("import", {
    importFrom: [
      {
        customProperties: {
          "--color": "var(--color-blue)",
        },
      },
      {
        customProperties: {
          "--color-blue": "blue",
          "--color-red": "red",
        },
      },
    ],
  });
});
