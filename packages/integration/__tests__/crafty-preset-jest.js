const test = require("ava");
const testUtils = require("../utils");

test.serial("Succeeds without transpiling", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/succeeds");

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
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

test.serial("Succeeds with esm module and babel", async t => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-jest/esm-babel");

  const result = await testUtils.run(["test"], cwd);

  t.snapshot(result);
  t.is(result.status, 0);
});
