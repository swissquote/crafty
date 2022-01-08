const test = require("ava");
const testUtils = require("../utils");

test.serial("Compiles CSS within webpack", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial(
  "Compiles CSS within webpack, extracts CSS ('extractCSS' boolean option)",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-postcss-webpack/extract-boolean"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    t.snapshot(result);
    t.is(result.status, 0);

    t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-default.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-default.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-default.min.css.map"));
    t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
    t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
    t.snapshot(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle-default.min.css")
    );
  }
);

test.serial(
  "Compiles CSS within webpack, extracts CSS ('extractCSS' string option)",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-postcss-webpack/extract-string"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    t.snapshot(result);
    t.is(result.status, 0);

    t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-string.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-string.min.css.map"));

    t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
    t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
    t.snapshot(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle-string.min.css")
    );
  }
);

test.serial(
  "Compiles CSS within webpack, extracts CSS ('extractCSS' object option)",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-postcss-webpack/extract-object"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    t.snapshot(result);
    t.is(result.status, 0);

    t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-object.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-object.min.css.map"));

    t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
    t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
    t.snapshot(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle-object.min.css")
    );
  }
);
