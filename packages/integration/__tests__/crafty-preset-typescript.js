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
