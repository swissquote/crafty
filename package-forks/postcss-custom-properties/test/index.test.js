const test = require("ava");
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

function testFixture(t, name, pluginOpts = {}, postcssOpts = {}) {
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

      t.deepEqual(result.css, expected);
      t.is(result.warnings().length, expectedWarnings);
    });
}

  test("supports basic usage", (t) => {
    return testFixture(t, "basic");
  });

  test("supports { preserve: false } usage", (t) => {
    return testFixture(t, 
      { input: "basic", output: "basic.preserve.expect" },
      {
        preserve: false,
      }
    );
  });

  test("supports { importFrom: { customProperties: { ... } } } usage", (t) => {
    return testFixture(t, 
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
  test("supports { importFrom() } usage", (t) => {
    return testFixture(t, 
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

  test("supports { async importFrom() } usage", (t) => {
    return testFixture(t, 
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

  test('supports { importFrom: "test/import-properties.json" } usage', (t) => {
    return testFixture(t, 
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: "test/fixtures/import-properties.json",
      }
    );
  });

  test('supports { importFrom: "test/import-properties{-2}?.js" } usage', (t) => {
    return testFixture(t, 
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          "test/fixtures/import-properties.js",
          "test/fixtures/import-properties-2.js",
        ],
      }
    );
  });

  test('supports { importFrom: "test/import-properties{-2}?.css" } usage', (t) => {
    return testFixture(t, 
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          "test/fixtures/import-properties.css",
          "test/fixtures/import-properties-2.css",
        ],
      }
    );
  });

  test('supports { importFrom: "test/import-properties{-2}?.{css|js}" } usage', (t) => {
    return testFixture(t, 
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          "test/fixtures/import-properties.js",
          "test/fixtures/import-properties-2.css",
        ],
      }
    );
  });

  test('supports { importFrom: "test/import-properties.{p}?css" } usage', (t) => {
    return testFixture(t, 
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          "test/fixtures/import-properties.pcss",
          "test/fixtures/import-properties-2.css",
        ],
      }
    );
  });

  test('supports { importFrom: { from: "test/import-properties.css" } } usage', (t) => {
    return testFixture(t, 
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          { from: "test/fixtures/import-properties.css" },
          { from: "test/fixtures/import-properties-2.css" },
        ],
      }
    );
  });

  test('supports { importFrom: [ { from: "test/import-properties.css", type: "css" } ] } usage', (t) => {
    return testFixture(t, 
      { input: "basic", output: "basic.import.expect" },
      {
        importFrom: [
          { from: "test/fixtures/import-properties.css", type: "css" },
          { from: "test/fixtures/import-properties-2.css", type: "css" },
        ],
      }
    );
  });

  test("importFrom with { preserve: false } should override root properties", (t) => {
    return testFixture(t, 
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

  test("supports { exportTo: { customProperties: { ... } } } usage", (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
        after() {
          t.deepEqual(global.__exportPropertiesObject.customProperties["--color"], 
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

  test("supports { exportTo() } usage", (t) => {
    let called = false;

    t.plan(4);

    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
      },
      {
        exportTo(customProperties) {
          called = true;
          t.deepEqual(customProperties["--color"], "rgb(255, 0, 0)");
        },
      }
    ).then(() => {
      t.truthy(called);
    });
  });

  test("supports { async exportTo() } usage", (t) => {
    let called = false;

    t.plan(4);

    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
      },
      {
        async exportTo(customProperties) {
          called = true;
          t.deepEqual(customProperties["--color"], "rgb(255, 0, 0)");
        },
      }
    ).then(() => {
      t.truthy(called);
    });
  });

  test('supports { exportTo: "test/export-properties.scss" } usage', (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global[`export_${t.title}`] = require("fs").readFileSync(
            "test/fixtures/export-properties.scss",
            "utf8"
          );
        },
        after() {
          if (
            global[`export_${t.title}`] !==
            require("fs").readFileSync(
              "test/fixtures/export-properties.scss",
              "utf8"
            )
          ) {
            throw new Error(
              "The original file did not match the freshly exported copy, content was: " + require("fs").readFileSync(
                "test/fixtures/export-properties.scss",
                "utf8"
              )
            );
          }
        },
      },
      {
        exportTo: "test/fixtures/export-properties.scss",
      }
    );
  });

  test('supports { exportTo: "test/export-properties.json" } usage', (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global[`export_${t.title}`] = require("fs").readFileSync(
            "test/fixtures/export-properties.json",
            "utf8"
          );
        },
        after() {
          if (
            global[`export_${t.title}`] !==
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

  test('supports { exportTo: "test/export-properties.js" } usage', (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global[`export_${t.title}`] = require("fs").readFileSync(
            "test/fixtures/export-properties.js",
            "utf8"
          );
        },
        after() {
          if (
            global[`export_${t.title}`] !==
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

  test('supports { exportTo: "test/export-properties.mjs" } usage', (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global[`export_${t.title}`] = require("fs").readFileSync(
            "test/fixtures/export-properties.mjs",
            "utf8"
          );
        },
        after() {
          if (
            global[`export_${t.title}`] !==
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

  test('supports { exportTo: "test/export-properties.css" } usage', (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global[`export_${t.title}`] = require("fs").readFileSync(
            "test/fixtures/export-properties.css",
            "utf8"
          );
        },
        after() {
          if (
            global[`export_${t.title}`] !==
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

  test('supports { exportTo: { to: "test/export-properties.css" } } usage', (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global[`export_${t.title}`] = require("fs").readFileSync(
            "test/fixtures/export-properties.css",
            "utf8"
          );
        },
        after() {
          if (
            global[`export_${t.title}`] !==
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

  test('supports { exportTo: { to: "test/export-properties.css", type: "css" } } usage', (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
        before() {
          global[`export_${t.title}`] = require("fs").readFileSync(
            "test/fixtures/export-properties.css",
            "utf8"
          );
        },
        after() {
          if (
            global[`export_${t.title}`] !==
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

  test('supports { exportTo: { to: "test/export-properties.css", type: "css" } } usage 2', (t) => {
    return testFixture(t, 
      {
        input: "basic",
        output: "basic.expect",
      },
      {
        importFrom: {},
      }
    );
  });
