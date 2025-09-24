import { test, expect } from "vitest";
import * as testUtils from "../utils.js";

const BUNDLE = "dist/js/myBundle.min.js";
const BUNDLE_MAP = `${BUNDLE}.map`;

test("Compiles CSS within webpack", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/compiles"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
});

test("Fails gracefully on broken markup", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/fails"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(1);

  expect(testUtils.exists(cwd, BUNDLE)).toBeFalsy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeFalsy();
});

test("Compiles CSS within webpack, extracts CSS ('extractCSS' boolean option)", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/extract-boolean"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-default.min.css")
  ).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-default.min.css")
  ).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-default.min.css.map")
  ).toBeTruthy();
  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle-default.min.css")
  ).toMatchSnapshot();
});

test("Compiles CSS within webpack, extracts CSS ('extractCSS' string option)", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/extract-string"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle-string.min.css")).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-string.min.css.map")
  ).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle-string.min.css")
  ).toMatchSnapshot();
});

test("Compiles CSS within webpack, extracts CSS ('extractCSS' object option)", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/extract-object"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/myBundle-object.min.css")).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/myBundle-object.min.css.map")
  ).toBeTruthy();

  expect(testUtils.readForSnapshot(cwd, BUNDLE)).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, "dist/js/myBundle-object.min.css")
  ).toMatchSnapshot();
});

test("Compiles CSS within webpack, CSS Modules, inline", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/modules-inline"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();

  const content = testUtils.readForSnapshot(cwd, BUNDLE);
  expect(content).toMatchSnapshot();

  expect(content.indexOf(".Button{color") > -1).toBeTruthy();
  expect(content.indexOf(".t-global .app_app__") > -1).toBeTruthy();
  expect(content.indexOf(".t-global .app_app2__") > -1).toBeTruthy();

  const subappContent = testUtils.readForSnapshot(
    cwd,
    "dist/js/subapp.myBundle.min.js"
  );
  expect(subappContent).toMatchSnapshot();

  expect(subappContent.indexOf("{color:orange}") > -1).toBeTruthy();
  expect(subappContent.indexOf(".subapp_") > -1).toBeTruthy();
});

test("Compiles CSS within webpack, CSS Modules, extracts CSS", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-postcss-webpack/modules-extract"
  );

  const result = await testUtils.run(["run", "default"], cwd);

  expect(result).toMatchSnapshot();
  expect(result.status).toBe(0);

  expect(testUtils.exists(cwd, BUNDLE)).toBeTruthy();
  expect(testUtils.exists(cwd, BUNDLE_MAP)).toBeTruthy();
  expect(
    testUtils.exists(cwd, "dist/js/default.myBundle.min.css")
  ).toBeTruthy();
  expect(testUtils.exists(cwd, "dist/js/subapp.myBundle.min.css")).toBeTruthy();

  const content = testUtils.readForSnapshot(
    cwd,
    "dist/js/default.myBundle.min.css"
  );
  expect(content).toMatchSnapshot();
  expect(content.indexOf(".Button{color") > -1).toBeTruthy();
  expect(content.indexOf(".t-global .app_app__") > -1).toBeTruthy();
  expect(content.indexOf(".t-global .app_app2__") > -1).toBeTruthy();

  const subappContent = testUtils.readForSnapshot(
    cwd,
    "dist/js/subapp.myBundle.min.css"
  );
  expect(subappContent).toMatchSnapshot();
  expect(subappContent.indexOf("{color:orange}") > -1).toBeTruthy();
  expect(subappContent.indexOf(".subapp_") > -1).toBeTruthy();
});
