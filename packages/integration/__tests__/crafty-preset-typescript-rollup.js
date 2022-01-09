const test = require("ava");
const testUtils = require("../utils");

test.serial("Works with rollup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myTSBundle.min.js"));
});

test.serial("Deletes rollup terser plugin using crafty.config.js", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/compiles-no-terser"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myTSBundle.min.js"));
});

test.serial("Keeps imports unresolved for Babel Runtime", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myTSBundle.min.js.map"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myTSBundle.min.js"));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Lints TypeScript with rollup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-typescript-rollup/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});
