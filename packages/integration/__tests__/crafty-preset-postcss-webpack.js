const test = require("ava");
const testUtils = require("../utils");

const BUNDLE = "dist/js/myBundle.min.js";
const BUNDLE_MAP = `${BUNDLE}.map`;

test.serial("Compiles CSS within webpack", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
});

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  t.falsy(testUtils.exists(cwd, BUNDLE));
  t.falsy(testUtils.exists(cwd, BUNDLE_MAP));
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

    t.truthy(testUtils.exists(cwd, BUNDLE));
    t.truthy(testUtils.exists(cwd, BUNDLE_MAP));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-default.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-default.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-default.min.css.map"));
    t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
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

    t.truthy(testUtils.exists(cwd, BUNDLE));
    t.truthy(testUtils.exists(cwd, BUNDLE_MAP));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-string.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-string.min.css.map"));

    t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
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

    t.truthy(testUtils.exists(cwd, BUNDLE));
    t.truthy(testUtils.exists(cwd, BUNDLE_MAP));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-object.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/myBundle-object.min.css.map"));

    t.snapshot(testUtils.readForSnapshot(cwd, BUNDLE));
    t.snapshot(
      testUtils.readForSnapshot(cwd, "dist/js/myBundle-object.min.css")
    );
  }
);

test.serial("Compiles CSS within webpack, CSS Modules, inline", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/modules-inline"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLE));
  t.truthy(testUtils.exists(cwd, BUNDLE_MAP));

  const content = testUtils.readForSnapshot(cwd, BUNDLE);
  t.snapshot(content);

  t.truthy(content.indexOf(".Button{color") > -1);
  t.truthy(content.indexOf(".t-global .app_") > -1);

  const subappContent = testUtils.readForSnapshot(
    cwd,
    "dist/js/subapp.myBundle.min.js"
  );
  t.snapshot(subappContent);

  t.truthy(subappContent.indexOf("{color:orange}") > -1);
  t.truthy(subappContent.indexOf(".subapp_") > -1);
});

test.serial(
  "Compiles CSS within webpack, CSS Modules, extracts CSS",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-postcss-webpack/modules-extract"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    t.snapshot(result);
    t.is(result.status, 0);

    t.truthy(testUtils.exists(cwd, BUNDLE));
    t.truthy(testUtils.exists(cwd, BUNDLE_MAP));
    t.truthy(testUtils.exists(cwd, "dist/js/default.myBundle.min.css"));
    t.truthy(testUtils.exists(cwd, "dist/js/subapp.myBundle.min.css"));

    const content = testUtils.readForSnapshot(
      cwd,
      "dist/js/default.myBundle.min.css"
    );
    t.snapshot(content);
    t.truthy(content.indexOf(".Button{color") > -1);
    t.truthy(content.indexOf(".t-global .app_") > -1);

    const subappContent = testUtils.readForSnapshot(
      cwd,
      "dist/js/subapp.myBundle.min.css"
    );
    t.snapshot(subappContent);
    t.truthy(subappContent.indexOf("{color:orange}") > -1);
    t.truthy(subappContent.indexOf(".subapp_") > -1);
  }
);
