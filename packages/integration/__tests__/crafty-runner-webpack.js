const test = require("ava");
const testUtils = require("../utils");

test.serial("Compiles Only with Webpack", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-runner-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
  t.truthy(testUtils.exists(cwd, "dist/js/690.myBundle.min.js"));
  t.truthy(testUtils.exists(cwd, "dist/js/690.myBundle.min.js.map"));

  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/myBundle.min.js"));
  t.snapshot(testUtils.readForSnapshot(cwd, "dist/js/690.myBundle.min.js"));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-runner-webpack/fails");

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});
