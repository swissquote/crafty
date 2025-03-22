const { test } = require("node:test");
const { readFileSync } = require("fs");
const { join } = require("path");
const { expect } = require("expect");
const postcss = require("postcss");

const plugin = require("../");

function fixturePath(name) {
  return join(__dirname, "fixtures", `${name}.css`);
}

function readFixture(name) {
  return readFileSync(fixturePath(name), "utf8");
}

function testFixture(t, name, pluginOpts = {}, postcssOpts = {}) {
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

test("supports very basic usage", (t) => {
  return testFixture(t, "very-basic");
});

test("works with spec examples", (t) => {
  return testFixture(t, "spec-example");
});

test("supports basic usage", (t) => {
  return testFixture(t, "basic");
});

test("ignores w3c color functions", (t) => {
  return testFixture(t, "w3c-color");
});

test("supports { stringifier } usage", (t) => {
  return testFixture(
    t,
    { input: "basic", output: "basic.colors.expect" },
    {
      stringifier: (color) => color.toString(),
    }
  );
});

test("supports { transformVars: false } usage", async (t) => {
  await expect(
    () =>
      testFixture(t, "basic", {
        transformVars: false,
      })
  ).rejects.toThrow(/Expected a color/);
});

test("supports { unresolved } usage", (t) => {
  return testFixture(
    t,
    { input: "warn", output: "warn", warnings: 43 },
    {
      unresolved: "warn",
    }
  );
});

test("supports hex usage", (t) => {
  return testFixture(t, "hex");
});

test('supports { importFrom: "test/import-root.css" } usage', (t) => {
  return testFixture(t, "import", {
    importFrom: "tests/fixtures/import-root.css",
  });
});

test('supports { importFrom: ["test/import-root.css"] } usage', (t) => {
  return testFixture(t, "import", {
    importFrom: ["tests/fixtures/import-root.css"],
  });
});

test('supports { importFrom: [["css", "test/import-root.css" ]] } usage', (t) => {
  return testFixture(t, "import", {
    importFrom: { from: "tests/fixtures/import-root.css", type: "css" },
  });
});

test('supports { importFrom: "test/import-root.js" } usage', (t) => {
  return testFixture(t, "import", {
    importFrom: "tests/fixtures/import-root.js",
  });
});

test('supports { importFrom: "test/import-root.json" } usage', (t) => {
  return testFixture(t, "import", {
    importFrom: "tests/fixtures/import-root.json",
  });
});

test("supports { importFrom: { customProperties: {} } } usage", (t) => {
  return testFixture(t, "import", {
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
