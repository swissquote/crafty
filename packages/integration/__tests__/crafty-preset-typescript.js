const test = require("ava");
const testUtils = require("../utils");

test.serial("Lints TypeScript using the command", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript/lints"
  );

  const result = await testUtils.run(["jsLint", "js/**/*.ts"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial(
  "Lints TypeScript using the command, --preset recommended, --preset node",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/lints"
    );

    const result = await testUtils.run(
      ["jsLint", "js/**/*.ts", "--preset", "recommended", "--preset", "node"],
      cwd
    );

    t.snapshot(result);
    t.is(result.status, 1);

    // Files aren't generated on failed lint
    t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
    t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
  }
);

test.serial(
  "Lints TypeScript using the command, --preset recommended",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-typescript/lints"
    );

    const result = await testUtils.run(
      ["jsLint", "js/**/*.ts", "--preset", "recommended"],
      cwd
    );

    t.snapshot(result);
    t.is(result.status, 1);

    // Files aren't generated on failed lint
    t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
    t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
  }
);

test.serial("Lints TypeScript using the command, --preset format", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript/lints"
  );

  const result = await testUtils.run(
    ["jsLint", "js/**/*.ts", "--preset", "format"],
    cwd
  );

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Tests Syntax using Prettier 1", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript/test-ts-syntax_legacy"
  );

  const result = await testUtils.run(["run"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/TS_4_0.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/webpack.min.js"));
});

test.serial("Tests Syntax using Prettier 2", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript/test-ts-syntax"
  );

  const result = await testUtils.run(["run"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/TS_4_0.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/webpack.min.js"));
});
