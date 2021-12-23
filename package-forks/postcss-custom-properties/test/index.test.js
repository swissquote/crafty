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

  let before = () => {};
  let after = () => {};

  if (typeof name !== "string") {
    fixtureName = name.input;
    fixtureExpect = name.output;

    if (name.warnings) {
      expectedWarnings = name.warnings;
    }

    if (name.before) {
      before = name.before;
    }

    if (name.after) {
      after = name.after;
    }
  }

  before();

  postcssOpts.from = fixturePath(fixtureName);
  let expected = readFixture(fixtureExpect);
  return postcss([plugin(pluginOpts)])
    .process(readFixture(fixtureName), postcssOpts)
    .then((result) => {
      after();

      expect(result.css).toEqual(expected);
      expect(result.warnings().length).toEqual(expectedWarnings);
    });
}

describe("postcss-custom-properties", () => {
  it("supports basic usage", () => {
    return testFixture("basic");
  });

  it("supports { preserve: false } usage", () => {
    return testFixture(
      { input: "basic", output: "basic.preserve.expect" },
      {
        preserve: false,
      }
    );
  });

  it("supports { importFrom: { customProperties: { ... } } } usage", () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: {
          customProperties: {
            "--color": "rgb(255, 0, 0)",
            "--color-2": "yellow",
            "--ref-color": "var(--color)",
            "--margin": "0 10px 20px 30px",
            "--z-index": 10,
          },
        },
      }
    );
  });
  it("supports { importFrom() } usage", () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom() {
          return {
            customProperties: {
              "--color": "rgb(255, 0, 0)",
              "--color-2": "yellow",
              "--ref-color": "var(--color)",
              "--margin": "0 10px 20px 30px",
              "--z-index": 10,
            },
          };
        },
      }
    );
  });

  it("supports { async importFrom() } usage", () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom() {
          return new Promise((resolve) => {
            resolve({
              customProperties: {
                "--color": "rgb(255, 0, 0)",
                "--color-2": "yellow",
                "--ref-color": "var(--color)",
                "--z-index": 10,
              },
            });
          });
        },
      }
    );
  });

  it('supports { importFrom: "test/import-properties.json" } usage', () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: "test/fixtures/import-properties.json",
      }
    );
  });

  it('supports { importFrom: "test/import-properties{-2}?.js" } usage', () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          "test/fixtures/import-properties.js",
          "test/fixtures/import-properties-2.js",
        ],
      }
    );
  });

  it('supports { importFrom: "test/import-properties{-2}?.css" } usage', () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          "test/fixtures/import-properties.css",
          "test/fixtures/import-properties-2.css",
        ],
      }
    );
  });

  it('supports { importFrom: "test/import-properties{-2}?.{css|js}" } usage', () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          "test/fixtures/import-properties.js",
          "test/fixtures/import-properties-2.css",
        ],
      }
    );
  });

  it('supports { importFrom: "test/import-properties.{p}?css" } usage', () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          "test/fixtures/import-properties.pcss",
          "test/fixtures/import-properties-2.css",
        ],
      }
    );
  });

  it('supports { importFrom: { from: "test/import-properties.css" } } usage', () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          { from: "test/fixtures/import-properties.css" },
          { from: "test/fixtures/import-properties-2.css" },
        ],
      }
    );
  });

  it('supports { importFrom: [ { from: "test/import-properties.css", type: "css" } ] } usage', () => {
    return testFixture(
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          { from: "test/fixtures/import-properties.css", type: "css" },
          { from: "test/fixtures/import-properties-2.css", type: "css" },
        ],
      }
    );
  });

  it("importFrom with { preserve: false } should override root properties", () => {
    return testFixture(
      { input: "basic", output: "basic.import-override.expect" },
      {
        preserve: false,
        importFrom: {
          customProperties: {
            "--color": "rgb(0, 0, 0)",
            "--color-2": "yellow",
            "--ref-color": "var(--color)",
            "--margin": "0 10px 20px 30px",
            "--shadow-color": "rgb(0,0,0)",
            "--z-index": 10,
          },
        },
      }
    );
  });

  it("supports { exportTo: { customProperties: { ... } } } usage", () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
        after() {
          expect(global.__exportPropertiesObject.customProperties["--color"]).toEqual(
            "rgb(255, 0, 0)"
          );
        },
      },
      {
        exportTo: (global.__exportPropertiesObject = global.__exportPropertiesObject || {
          customProperties: null,
        }),
      }
    );
  });

  it("supports { exportTo() } usage", () => {
    let called = false;

    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
      },
      {
        exportTo(customProperties) {
          called = true;
          expect(customProperties["--color"]).toEqual("rgb(255, 0, 0)");
        },
      }
    ).then(() => {
      expect(called).toBeTruthy();
    });
  });

  it("supports { async exportTo() } usage", () => {
    let called = false;

    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
      },
      {
        async exportTo(customProperties) {
          called = true;
          expect(customProperties["--color"]).toEqual("rgb(255, 0, 0)");
        },
      }
    ).then(() => {
      expect(called).toBeTruthy();
    });
  });

  it('supports { exportTo: "test/export-properties.scss" } usage', () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global.__exportPropertiesString = require("fs").readFileSync(
            "test/fixtures/export-properties.scss",
            "utf8"
          );
        },
        after() {
          if (
            global.__exportPropertiesString !==
            require("fs").readFileSync(
              "test/fixtures/export-properties.scss",
              "utf8"
            )
          ) {
            throw new Error(
              "The original file did not match the freshly exported copy"
            );
          }
        },
      },
      {
        exportTo: "test/fixtures/export-properties.scss",
      }
    );
  });

  it('supports { exportTo: "test/export-properties.json" } usage', () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global.__exportPropertiesString = require("fs").readFileSync(
            "test/fixtures/export-properties.json",
            "utf8"
          );
        },
        after() {
          if (
            global.__exportPropertiesString !==
            require("fs").readFileSync(
              "test/fixtures/export-properties.json",
              "utf8"
            )
          ) {
            throw new Error(
              "The original file did not match the freshly exported copy"
            );
          }
        },
      },
      {
        exportTo: "test/fixtures/export-properties.json",
      }
    );
  });

  it('supports { exportTo: "test/export-properties.js" } usage', () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global.__exportPropertiesString = require("fs").readFileSync(
            "test/fixtures/export-properties.js",
            "utf8"
          );
        },
        after() {
          if (
            global.__exportPropertiesString !==
            require("fs").readFileSync(
              "test/fixtures/export-properties.js",
              "utf8"
            )
          ) {
            throw new Error(
              "The original file did not match the freshly exported copy"
            );
          }
        },
      },
      {
        exportTo: "test/fixtures/export-properties.js",
      }
    );
  });

  it('supports { exportTo: "test/export-properties.mjs" } usage', () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global.__exportPropertiesString = require("fs").readFileSync(
            "test/fixtures/export-properties.mjs",
            "utf8"
          );
        },
        after() {
          if (
            global.__exportPropertiesString !==
            require("fs").readFileSync(
              "test/fixtures/export-properties.mjs",
              "utf8"
            )
          ) {
            throw new Error(
              "The original file did not match the freshly exported copy"
            );
          }
        },
      },
      {
        exportTo: "test/fixtures/export-properties.mjs",
      }
    );
  });

  it('supports { exportTo: "test/export-properties.css" } usage', () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global.__exportPropertiesString = require("fs").readFileSync(
            "test/fixtures/export-properties.css",
            "utf8"
          );
        },
        after() {
          if (
            global.__exportPropertiesString !==
            require("fs").readFileSync(
              "test/fixtures/export-properties.css",
              "utf8"
            )
          ) {
            throw new Error(
              "The original file did not match the freshly exported copy"
            );
          }
        },
      },
      {
        exportTo: "test/fixtures/export-properties.css",
      }
    );
  });

  it('supports { exportTo: { to: "test/export-properties.css" } } usage', () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global.__exportPropertiesString = require("fs").readFileSync(
            "test/fixtures/export-properties.css",
            "utf8"
          );
        },
        after() {
          if (
            global.__exportPropertiesString !==
            require("fs").readFileSync(
              "test/fixtures/export-properties.css",
              "utf8"
            )
          ) {
            throw new Error(
              "The original file did not match the freshly exported copy"
            );
          }
        },
      },
      {
        exportTo: { to: "test/fixtures/export-properties.css" },
      }
    );
  });

  it('supports { exportTo: { to: "test/export-properties.css", type: "css" } } usage', () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global.__exportPropertiesString = require("fs").readFileSync(
            "test/fixtures/export-properties.css",
            "utf8"
          );
        },
        after() {
          if (
            global.__exportPropertiesString !==
            require("fs").readFileSync(
              "test/fixtures/export-properties.css",
              "utf8"
            )
          ) {
            throw new Error(
              "The original file did not match the freshly exported copy"
            );
          }
        },
      },
      {
        exportTo: { to: "test/fixtures/export-properties.css", type: "css" },
      }
    );
  });

  it('supports { exportTo: { to: "test/export-properties.css", type: "css" } } usage', () => {
    return testFixture(
      {
        input: "basic",
        output: "basic.expect",
      },
      {
        importFrom: {},
      }
    );
  });
});
