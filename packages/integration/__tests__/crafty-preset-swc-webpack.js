const test = require("ava");
const testUtils = require("../utils");

const BUNDLE = "dist/js/myBundle.min.js";
const BUNDLE_MAP = `${BUNDLE}.map`;

test.serial("Compiles JavaScript", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/compiles"
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
    "crafty-preset-swc-webpack/compiles-import-runtime"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Compiles JavaScript with webpack overrides", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/compiles-merge-webpack-config"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Compiles Generators", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/compiles-generators"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Deduplicates helpers", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/compiles-deduplicates"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Does not transpile on modern browsers", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/no-old-browser"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Compiles JavaScript with externals", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/externals"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Creates profiles", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/profiles"
  );

  const result = await testUtils.run(["run", "default", "--profile"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));
  t.truthy(testUtils.exists(cwd, "dist/js/myBundle_report.html"));
  t.truthy(testUtils.exists(cwd, "dist/js/myBundle_stats.json"));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Lints JavaScript with webpack", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/lints"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, BUNDLE));
  t.falsy(testUtils.exists(cwd, BUNDLE_MAP));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, BUNDLE));
  t.falsy(testUtils.exists(cwd, BUNDLE_MAP));
});

// Doesn't seem to work yet
test.serial("Removes unused classes", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-swc-webpack/tree-shaking"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  const content = testUtils.readFile(cwd, BUNDLE);

  t.truthy(content.indexOf("From class A") > -1);
  t.falsy(content.indexOf("From class B") > -1);
});
