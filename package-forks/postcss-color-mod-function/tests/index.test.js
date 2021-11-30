const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const plugin = require("../");

function fixturePath(name) {
  return path.join(__dirname, "fixtures", `${name}.css`);
}

function readFixture(name) {
  return fs.readFileSync(fixturePath(name), "utf8");
}

function testFixture(name, pluginOpts = {}, postcssOpts = {}) {
  let expectedWarnings = 0;
  let fixtureName = name;
  let fixtureExpect = `${name}.expect`;

  if (typeof name != "string") {
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
      expect(result.css).toEqual(expected);
      expect(result.warnings().length).toEqual(expectedWarnings);
    });
}

describe("postcss-color-mod-function", () => {
  it("supports very basic usage", () => {
    return testFixture("very-basic");
  });

  it("works with spec examples", () => {
    return testFixture("spec-example");
  });

  it("supports basic usage", () => {
    return testFixture("basic");
  });

  it("supports { stringifier } usage", () => {
    return testFixture(
      { input: "basic", output: "basic.colors.expect" },
      {
        stringifier: (color) => color.toString(),
      }
    );
  });

  it("supports { transformVars: false } usage", async () => {
    await expect(() =>
      testFixture("basic", {
        transformVars: false,
      })
    ).rejects.toThrow(/Expected a color/);
  });

  it("supports { unresolved } usage", () => {
    return testFixture(
      { input: "warn", output: "warn", warnings: 43 },
      {
        unresolved: "warn",
      }
    );
  });

  it("supports hex usage", () => {
    return testFixture("hex");
  });

  it('supports { importFrom: "test/import-root.css" } usage', () => {
    return testFixture("import", {
      importFrom: "tests/fixtures/import-root.css",
    });
  });

  it('supports { importFrom: ["test/import-root.css"] } usage', () => {
    return testFixture("import", {
      importFrom: ["tests/fixtures/import-root.css"],
    });
  });

  it('supports { importFrom: [["css", "test/import-root.css" ]] } usage', () => {
    return testFixture("import", {
      importFrom: { from: "tests/fixtures/import-root.css", type: "css" },
    });
  });

  it('supports { importFrom: "test/import-root.js" } usage', () => {
    return testFixture("import", {
      importFrom: "tests/fixtures/import-root.js",
    });
  });

  it('supports { importFrom: "test/import-root.json" } usage', () => {
    return testFixture("import", {
      importFrom: "tests/fixtures/import-root.json",
    });
  });

  it("supports { importFrom: { customProperties: {} } } usage", () => {
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
});
