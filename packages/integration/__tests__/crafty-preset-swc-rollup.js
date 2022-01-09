const test = require("ava");
const testUtils = require("../utils");

const BUNDLE = "dist/js/myBundle.min.js";
const BUNDLE_MAP = "dist/js/myBundle.min.js.map";

test.serial("Compiles JavaScript with rollup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-rollup/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Keeps imports unresolved for SWC Runtime", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-rollup/compiles-import-runtime"
  );
  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial(
  "Keeps imports unresolved for SWC Runtime, using commonjs",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-swc-rollup/compiles-import-runtime-commonjs"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    t.snapshot(result);
    t.is(result.status, 0);

    t.truthy(testUtils.exists(cwd, BUNDLE));
    t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

    t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
  }
);

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-rollup/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  t.falsy(testUtils.exists(cwd, BUNDLE));
  t.falsy(testUtils.exists(cwd, BUNDLE_MAP));
});

test.serial("Lints JavaScript with rollup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-rollup/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, BUNDLE));
  t.falsy(testUtils.exists(cwd, BUNDLE_MAP));
});
