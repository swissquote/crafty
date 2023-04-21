const test = require("ava");
const configuration = require("@swissquote/crafty/src/configuration");
const getCommands = require("@swissquote/crafty/src/commands/index");
const testUtils = require("../utils");

const getCrafty = configuration.getCrafty;

const PRESET_SWC = "@swissquote/crafty-preset-swc";

test("Loads crafty-preset-swc and does not register webpack tasks", async t => {
  const crafty = await getCrafty([PRESET_SWC], {});

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes(PRESET_SWC));

  const commands = getCommands(crafty);
  t.truthy(Object.keys(commands).includes("jsLint"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), []);
});

test("Loads crafty-preset-swc, crafty-runner-webpack and registers webpack task", async t => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    [PRESET_SWC, "@swissquote/crafty-runner-webpack"],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes(PRESET_SWC));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-webpack"));

  const commands = getCommands(crafty);
  t.truthy(Object.keys(commands).includes("jsLint"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), [
    "js_myBundle",
    "js",
    "default"
  ]);
});

test("Fails on double runner with incorrect bundle assignment", async t => {
  const config = { js: { myBundle: { source: "css/style.scss" } } };
  const crafty = await getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes(PRESET_SWC));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-webpack"));

  t.throws(() => crafty.createTasks(), {
    message:
      "You have multiple runners, please specify a runner for 'myBundle'. Available runners are ['gulp/swc', 'webpack']."
  });
});

test("Fails on double runner with imprecise bundle assignment", async t => {
  const config = {
    js: { myBundle: { runner: "gulp", source: "css/style.scss" } }
  };
  const crafty = await getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes(PRESET_SWC));
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-typescript"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));

  t.throws(() => crafty.createTasks(), {
    message:
      "More than one valid runner exists for 'myBundle'. Has to be one of ['gulp/swc', 'gulp/typescript']."
  });
});

test("Fails on non-existing runners", async t => {
  const config = {
    js: { myBundle: { runner: "someRunner", source: "css/style.scss" } }
  };
  const crafty = await getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-preset-typescript",
      "@swissquote/crafty-runner-gulp"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes(PRESET_SWC));
  t.truthy(loadedPresets.includes("@swissquote/crafty-preset-typescript"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));

  t.throws(() => crafty.createTasks(), {
    message:
      "Invalid runner 'someRunner' for 'myBundle'. Has to be one of ['gulp/swc', 'gulp/typescript']."
  });
});

test("Assigns bundle only once when runner is specified", async t => {
  const config = {
    js: { myBundle: { runner: "webpack", source: "css/style.scss" } }
  };
  const crafty = await getCrafty(
    [
      PRESET_SWC,
      "@swissquote/crafty-runner-gulp",
      "@swissquote/crafty-runner-webpack"
    ],
    config
  );

  const loadedPresets = crafty.config.loadedPresets.map(
    preset => preset.presetName
  );
  t.truthy(loadedPresets.includes(PRESET_SWC));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-gulp"));
  t.truthy(loadedPresets.includes("@swissquote/crafty-runner-webpack"));

  const commands = getCommands(crafty);
  t.truthy(Object.keys(commands).includes("jsLint"));

  crafty.createTasks();
  t.deepEqual(Object.keys(crafty.undertaker._registry.tasks()), [
    "js_myBundle",
    "js",
    "default"
  ]);
});

test.serial("Lints JavaScript using command", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(["jsLint", "js/**/*.js"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Generates IDE Helper", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/ide", [
    ".eslintrc.js",
    "prettier.config.js",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);

  t.snapshot(testUtils.readForSnapshot(cwd, ".eslintrc.js"));

  t.snapshot(testUtils.readForSnapshot(cwd, "prettier.config.js"));

  t.snapshot(testUtils.readForSnapshot(cwd, ".gitignore"));
});

test.serial(
  "Lints JavaScript using command, ignore crafty.config.js",
  async t => {
    const cwd = await testUtils.getCleanFixtures(
      "crafty-preset-swc/lints-ignore-config"
    );

    const result = await testUtils.run(
      [
        "--preset",
        PRESET_SWC,
        "--ignore-crafty-config",
        "jsLint",
        "crafty.config.js"
      ],
      cwd
    );

    t.snapshot(result);
    t.is(result.status, 1);

    // Files aren't generated on failed lint
    t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
    t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
  }
);

test.serial("Lints JavaScript using command, legacy", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints-es5");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "legacy"],
    cwd
  );

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Lints JavaScript using command, format preset", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "format"],
    cwd
  );

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial("Lints JavaScript using command, recommended preset", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

  const result = await testUtils.run(
    ["jsLint", "js/**/*.js", "--preset", "recommended"],
    cwd
  );

  t.snapshot(result);
  t.is(result.status, 1);

  // Files aren't generated on failed lint
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
  t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
});

test.serial(
  "Lints JavaScript using command, explicit configuration",
  async t => {
    const cwd = await testUtils.getCleanFixtures("crafty-preset-swc/lints");

    const result = await testUtils.run(
      ["jsLint", "js/**/*.js", "--config", "eslintOverride.json"],
      cwd
    );

    t.snapshot(result);
    t.is(result.status, 1);

    // Files aren't generated on failed lint
    t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js"));
    t.falsy(testUtils.exists(cwd, "dist/js/myBundle.min.js.map"));
  }
);
