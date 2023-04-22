const test = require("ava");
const testUtils = require("../utils");

test.serial("Succeeds without transpiling", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/succeeds");

  const result = await testUtils.run(["test"], cwd);

  t.is(result.status, 0);
  t.true(result.stdall.includes("src/__tests__/math.js"));
  t.true(result.stdall.includes("src/__tests__/math-advanced.js"));
});

test.serial("Succeeds without transpiling, selects test", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/succeeds");

  const result = await testUtils.run(
    ["test", "__tests__/math-advanced.js"],
    cwd
  );

  t.false(result.stdall.includes("src/__tests__/math.js"));
  t.true(result.stdall.includes("src/__tests__/math-advanced.js"));

  t.snapshot(result);
});

test.serial("Shows configuration", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/succeeds");

  const result = await testUtils.run(["test", "--showConfig"], cwd);

  t.is(result.status, 0);
  t.true(result.stdall.includes("moduleNameMapper"));
  t.true(result.stdall.includes("testRegex"));
});

test.serial("Creates IDE Integration files", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/ide", [
    "jest.config.js",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
  t.snapshot(testUtils.readForSnapshot(cwd, "jest.config.js"));

  t.snapshot(testUtils.readForSnapshot(cwd, ".gitignore"));
});

test.serial("Creates IDE Integration files with Babel", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/ide-babel", [
    "jest.config.js",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
  t.snapshot(testUtils.readForSnapshot(cwd, "jest.config.js"));
});

test.serial("Succeeds with typescript", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/typescript");

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});

test.serial("Succeeds with typescript modules", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/typescript-modules"
  );

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});

test.serial("Succeeds with typescript modules in esm mode", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/typescript-modules-mjs"
  );

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});

test.serial("Succeeds with babel", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/babel");

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});

test.serial("Fails with babel", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/babel-fails"
  );

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 1);
});

test.serial("Succeeds with babel and React", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/babel-react"
  );

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});

test.serial("Succeeds with esm module", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/esm");

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});

test.serial("Succeeds with esm dependency", async t => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-jest/esm-dependency"
  );

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});

test.serial("Succeeds with esm dependency and babel", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/esm-babel");

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});
