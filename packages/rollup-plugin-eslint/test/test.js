const test = require("ava");
const fs = require("fs");
const { rollup } = require("rollup");
const nodeResolve = require("@rollup/plugin-node-resolve").default;
const eslint = require("../");

class FakeConsole {
  constructor() {
    this.out = [];
  }

  log() {
    this.out = this.out.concat(Array.prototype.slice.call(arguments));
  }
}

test.beforeEach((t) => {
  t.context.fakeConsole = new FakeConsole();
});

test("should lint files", (t) => {
  t.plan(2);
  let count = 0;
  return rollup({
    input: "./test/fixtures/undeclared.js",
    plugins: [
      eslint({
        formatter: (results) => {
          count += results[0].messages.length;
          const message = results[0].messages[0].message;
          t.deepEqual(message, "'x' is not defined.");
        },
      }),
    ],
  }).then(() => {
    t.is(count, 1);
  });
});

test("should not fail with default options", async (t) => {
  await rollup({
    input: "./test/fixtures/undeclared.js",
    plugins: [eslint({ __customConsole: t.context.fakeConsole })],
  });

  t.snapshot(t.context.fakeConsole.out);
});

test("should ignore node_modules with exclude option", (t) => {
  t.plan(2);
  let count = 0;
  return rollup({
    input: "./test/fixtures/modules.js",
    plugins: [
      nodeResolve({ jsnext: true }),
      eslint({
        overrideConfigFile: "./test/fixtures/.eslintrc-babel",
        formatter: (reports) => {
          const cwd = process.cwd();

          t.snapshot(
            reports.map((report) => ({
              ...report,
              filePath: report.filePath.replace(cwd, "__PATH__"),
            }))
          );
          count += 1;
        },
      }),
    ],
  }).then(() => {
    t.is(count, 1);
  });
});

test("should ignore files according .eslintignore", (t) => {
  t.plan(1);
  let count = 0;
  return rollup({
    input: "./test/fixtures/ignored.js",
    plugins: [
      eslint({
        formatter: () => {
          count += 1;
        },
      }),
    ],
  }).then(() => {
    t.is(count, 0);
  });
});

test("should fail with enabled throwOnWarning and throwOnError options", (t) => {
  return t.throwsAsync(
    rollup({
      input: "./test/fixtures/use-strict.js",
      plugins: [
        eslint({
          throwOnWarning: true,
          throwOnError: true,
          formatter: () => "",
        }),
      ],
    }),
    { message: /Warnings or errors were found/ }
  );
});

test("should fail with enabled throwOnError option", async (t) => {
  const error = await t.throwsAsync(
    rollup({
      input: "./test/fixtures/use-strict.js",
      plugins: [
        eslint({
          throwOnError: true,
          formatter: () => "",
        }),
      ],
    }),
    { message: /Errors were found/ }
  );
});

test("should fail with enabled throwOnWarning option", (t) => {
  return t.throwsAsync(
    rollup({
      input: "./test/fixtures/use-strict.js",
      plugins: [
        eslint({
          throwOnWarning: true,
          formatter: () => "",
        }),
      ],
    }),
    { message: /Warnings were found/ }
  );
});

test("should not fail with throwOnError and throwOnWarning disabled", (t) => {
  return t.notThrowsAsync(() =>
    rollup({
      input: "./test/fixtures/use-strict.js",
      plugins: [
        eslint({
          throwOnError: false,
          throwOnWarning: false,
          formatter: () => "",
        }),
      ],
    })
  );
});

test("should fail with not found formatter", (t) => {
  return t.throwsAsync(
    () => {
      return rollup({
        input: "./test/fixtures/use-strict.js",
        plugins: [
          eslint({
            useEslintrc: false,
            formatter: "not-found-formatter",
          }),
        ],
      });
    },
    { message: /There was a problem loading formatter/ }
  );
});

test("should not fail with found formatter", async (t) => {
  await rollup({
    input: "./test/fixtures/use-strict.js",
    plugins: [
      eslint({
        __customConsole: t.context.fakeConsole,
        formatter: "stylish",
      }),
    ],
  });

  t.snapshot(t.context.fakeConsole.out);
});

test("should fix source code", (t) => {
  fs.writeFileSync(
    "./test/fixtures/fixable-clone.js",
    fs.readFileSync("./test/fixtures/fixable.js")
  );
  return rollup({
    input: "./test/fixtures/fixable-clone.js",
    plugins: [
      eslint({
        fix: true,
      }),
    ],
  }).then(() => {
    t.deepEqual(
      fs.readFileSync("./test/fixtures/fixable-clone.js").toString(),
      fs.readFileSync("./test/fixtures/fixed.js").toString()
    );
    fs.unlinkSync("./test/fixtures/fixable-clone.js");
  });
});
