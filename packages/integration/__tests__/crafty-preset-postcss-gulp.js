const test = require("ava");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");

const testUtils = require("../utils");

const BUNDLED_CSS = "dist/css/myBundle.min.css";
const BUNDLED_CSS_MAPS = "dist/css/myBundle.min.css.map";

const getCrafty = configuration.getCrafty;

test("Loads crafty-preset-postcss, crafty-runner-gulp and registers gulp task", t => {
  const config = { myBundle: { source: "css/style.scss" } };
  const crafty = getCrafty(
    ["@swissquote/crafty-preset-postcss", "@swissquote/crafty-runner-gulp"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-postcss"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));

  const commands = getCommands(crafty);
  t.truthy(Object.keys(commands).includes("cssLint"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), [
    "css__lint",
    "default"
  ]);
});

test.serial("Doesn't compile without a task, but lints", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/no-bundle"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);

  t.falsy(testUtils.exists(cwd, "dist"));
});

test.serial(
  "Doesn't compile without a task, but lints (doesn't throw in development)",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-postcss-gulp/no-bundle-dev"
    );

    const result = await testUtils.run(["run", "default"], cwd);

    t.snapshot(result);
    t.is(result.status, 0);

    t.falsy(testUtils.exists(cwd, "dist"));
  }
);

test.serial("Fails gracefully on broken markup", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  t.falsy(testUtils.exists(cwd, "dist"));
});

test.serial("Experiment with all CSS", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/experiment"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLED_CSS));
  t.truthy(testUtils.exists(cwd, BUNDLED_CSS_MAPS));

  t.snapshot(testUtils.snapshotizeCSS(testUtils.readFile(cwd, BUNDLED_CSS)));
});

test.serial("Experiment with all CSS, old browsers", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/experiment_old_browsers"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLED_CSS));
  t.truthy(testUtils.exists(cwd, BUNDLED_CSS_MAPS));

  t.snapshot(testUtils.snapshotizeCSS(testUtils.readFile(cwd, BUNDLED_CSS)));
});

test.serial("Compiles CSS", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLED_CSS));
  t.truthy(testUtils.exists(cwd, BUNDLED_CSS_MAPS));
  t.falsy(testUtils.exists(cwd, "dist/css/imported.scss"));

  t.deepEqual(
    testUtils.readFile(cwd, BUNDLED_CSS),
    ".Link{color:#00f}.BodyComponent{margin:0}\n/*# sourceMappingURL=myBundle.min.css.map */"
  );
});

test.serial("Compiles CSS, configuration has overrides", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles-with-overrides"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLED_CSS));
  t.truthy(testUtils.exists(cwd, BUNDLED_CSS_MAPS));
  t.falsy(testUtils.exists(cwd, "dist/css/imported.scss"));

  t.deepEqual(
    testUtils.readFile(cwd, BUNDLED_CSS),
    ".Link{color:#fa5b35}.BodyComponent{margin:0}\n/*# sourceMappingURL=myBundle.min.css.map */"
  );
});

test.serial("Compiles CSS, configuration preserve", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles-preserve"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLED_CSS));
  t.truthy(testUtils.exists(cwd, BUNDLED_CSS_MAPS));
  t.falsy(testUtils.exists(cwd, "dist/css/imported.scss"));

  t.deepEqual(
    testUtils.readFile(cwd, BUNDLED_CSS),
    ":root{--color:blue}" +
      ".Link{color:#fa5b35;color:var(--color)}" +
      ":root{--BodyComponent-color:var(--color)}" +
      ".BodyComponent{color:#fa5b35;color:var(--BodyComponent-color);margin:0}\n" +
      "/*# sourceMappingURL=myBundle.min.css.map */"
  );
});

test.serial("Compiles CSS, compiles color-function", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-gulp/compiles-color-function"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.truthy(testUtils.exists(cwd, BUNDLED_CSS));
  t.truthy(testUtils.exists(cwd, BUNDLED_CSS_MAPS));
  t.falsy(testUtils.exists(cwd, "dist/css/imported.scss"));

  t.deepEqual(
    testUtils.readFile(cwd, BUNDLED_CSS),
    ":root{--color-default:#d1d1d1;--color-light:var(--color-default)}.Button{color:#fafafa;background-color:var(--color-light)}\n" +
      "/*# sourceMappingURL=myBundle.min.css.map */"
  );
});
