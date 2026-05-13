import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { test, expect } from "vitest";
import * as testUtils from "../utils.js";

const requireModule = createRequire(import.meta.url);
const { materializeVitestOptions } = requireModule(
  "@swissquote/crafty-preset-vitest"
);

test("Succeeds without transpiling", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-vitest/succeeds");

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("src/__tests__/math.js")).toBeTruthy();
  expect(result.stdall.includes("src/__tests__/math-advanced.js")).toBeTruthy();
});

test("Succeeds without transpiling, selects test", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-vitest/succeeds");

  const result = await testUtils.run(
    ["test", "__tests__/math-advanced.js"],
    cwd
  );

  expect(result.status).toBe(0);
  expect(result.stdall.includes("src/__tests__/math.js")).toBeFalsy();
  expect(result.stdall.includes("src/__tests__/math-advanced.js")).toBeTruthy();
});

test("Shows help without running tests", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/succeeds",
    ["dist", "reports"]
  );

  const result = await testUtils.run(["test", "--help"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("Usage:")).toBeTruthy();
  expect(result.stdall.includes("src/__tests__/math.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "reports/sonar-report.xml")).toBeFalsy();
});

test("Shows configuration without running tests", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/succeeds",
    ["dist", "reports"]
  );

  const result = await testUtils.run(["test", "--showConfig"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("include:")).toBeTruthy();
  expect(result.stdall.includes("reporters:")).toBeTruthy();
  expect(result.stdall.includes("src/__tests__/math.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "reports/sonar-report.xml")).toBeFalsy();
});

test("Fails when a Vitest suite fails", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-vitest/fails");

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(1);
  expect(result.stdall.includes("src/__tests__/failing.js")).toBeTruthy();
  expect(result.stdall.includes("crafty test: Vitest failed")).toBeFalsy();
  expect(
    result.stdall.includes("crafty test: One or more test runners failed")
  ).toBeFalsy();
});

test("Succeeds with Crafty-only CLI flags stripped from the Vitest argv", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-vitest/succeeds");

  const result = await testUtils.run(
    ["test", "--moduleFileExtensions", "js,json,mjs,cjs,ts"],
    cwd
  );

  expect(result.status).toBe(0);
  expect(
    result.stdall.includes("src/__tests__/math-typescript.ts")
  ).toBeTruthy();
});

test("Supports the Crafty sonar reporter alias with Vitest", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/succeeds",
    ["dist", "reports"]
  );

  const result = await testUtils.run(["test", "--reporters", "sonar"], cwd);

  expect(result.status).toBe(0);
  expect(testUtils.exists(cwd, "reports/sonar-report.xml")).toBeTruthy();
  expect(testUtils.readFile(cwd, "reports/sonar-report.xml")).toContain(
    '<testExecutions version="1">'
  );
  expect(testUtils.readFile(cwd, "reports/sonar-report.xml")).toContain(
    '<file path="src/__tests__/math.js">'
  );
});

test("Resolves modules from custom module directories through the preset hook", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/hook-module-directories"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
  expect(
    result.stdall.includes("src/__tests__/module-directories.js")
  ).toBeTruthy();
});

test("Resolves modules from nested custom module directories through the preset hook", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/hook-module-directories-nested"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
  expect(
    result.stdall.includes("src/a/b/__tests__/module-directories.js")
  ).toBeTruthy();
});

test("Installs custom module directory resolution before user setup files", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/hook-module-directories-setup-file"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("src/__tests__/setup-file.js")).toBeTruthy();
});

test("Does not install custom module directory resolution while materializing config", () => {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "crafty-vitest-materialize-")
  );
  const project = path.join(root, "project");
  const importer = path.join(project, "src", "__tests__", "sample.js");
  const setupFile = path.join(project, "src", "setup.js");
  const customModule = path.join(
    project,
    "src",
    "test_modules",
    "shared-value",
    "index.js"
  );
  const originalModuleResolution = process.env.CRAFTY_VITEST_MODULE_RESOLUTION;
  const requireFromImporter = createRequire(importer);

  fs.mkdirSync(path.dirname(importer), { recursive: true });
  fs.mkdirSync(path.dirname(customModule), { recursive: true });
  fs.writeFileSync(importer, "// test file\n");
  fs.writeFileSync(setupFile, 'module.exports = require("shared-value");\n');
  fs.writeFileSync(customModule, 'module.exports = "ok";\n');

  try {
    expect(() => requireFromImporter.resolve("shared-value")).toThrow();

    const options = materializeVitestOptions({
      test: {
        setupFiles: [setupFile]
      },
      craftyModuleResolution: {
        moduleDirectories: ["node_modules", "test_modules"],
        moduleFileExtensions: ["js"]
      }
    });

    const moduleDirectoriesSetupFile = requireModule.resolve(
      "@swissquote/crafty-preset-vitest/src/module-directories-setup.js"
    );

    expect(options.test.setupFiles).toContain(moduleDirectoriesSetupFile);
    expect(options.test.setupFiles[0]).toBe(moduleDirectoriesSetupFile);
    expect(options.test.setupFiles[1]).toBe(setupFile);
    expect(() => requireFromImporter.resolve("shared-value")).toThrow();
  } finally {
    if (originalModuleResolution === undefined) {
      delete process.env.CRAFTY_VITEST_MODULE_RESOLUTION;
    } else {
      process.env.CRAFTY_VITEST_MODULE_RESOLUTION = originalModuleResolution;
    }

    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("Ignores native JavaScript Vitest config", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/native-config-js"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("src/__tests__/native-config.js")).toBeTruthy();
});

test("Replaces JavaScript Vitest config with IDE Integration files", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/native-config-js",
    ["vitest.config.crafty.mjs", ".vscode", ".gitignore"]
  );

  fs.writeFileSync(
    path.join(cwd, "vitest.config.js"),
    `module.exports = {
  test: {
    setupFiles: ["./src/native-setup.js"]
  }
};
`
  );

  expect(testUtils.exists(cwd, "vitest.config.js")).toBeTruthy();

  const result = await testUtils.run(["ide"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("Written vitest.config.mjs")).toBeTruthy();
  expect(result.stdall.includes("Written .vscode/settings.json")).toBeTruthy();
  expect(testUtils.exists(cwd, "vitest.config.js")).toBeFalsy();
  expect(testUtils.readForSnapshot(cwd, "vitest.config.mjs")).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, ".vscode/settings.json")
  ).toMatchSnapshot();
});

test("Ignores native TypeScript Vitest config", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/native-config-ts"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("src/__tests__/native-config.js")).toBeTruthy();
});

test("Ignores function-based Vitest config", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/native-config-function"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("src/__tests__/native-config.js")).toBeTruthy();
});

test("Replaces legacy Vitest IDE config files", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/native-config-function",
    [".vscode", ".gitignore"]
  );

  fs.writeFileSync(
    path.join(cwd, "vitest.config.js"),
    `module.exports = () => ({
  test: {
    setupFiles: ["./src/native-setup.js"]
  }
});
`
  );
  fs.writeFileSync(
    path.join(cwd, "vitest.config.crafty.mjs"),
    `// AUTOGENERATED BY CRAFTY - DO NOT EDIT
// Legacy Vitest IDE config fixture

export default {};
`
  );

  expect(testUtils.exists(cwd, "vitest.config.js")).toBeTruthy();
  expect(testUtils.exists(cwd, "vitest.config.crafty.mjs")).toBeTruthy();

  const result = await testUtils.run(["ide"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("Written vitest.config.mjs")).toBeTruthy();
  expect(result.stdall.includes("Written .vscode/settings.json")).toBeTruthy();
  expect(testUtils.exists(cwd, "vitest.config.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "vitest.config.crafty.mjs")).toBeFalsy();
  expect(testUtils.readForSnapshot(cwd, "vitest.config.mjs")).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, ".vscode/settings.json")
  ).toMatchSnapshot();
});

test("Loads TypeScript tests through the preset hook", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/hook-typescript"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
});

test("Loads the React setup file through the preset hook", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/hook-react"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
});

test("Loads JSX tests through the Babel preset hook", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/hook-babel"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
});

test("Loads JSX tests through the SWC preset hook", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-vitest/hook-swc");

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(0);
});

test("Fails clearly when a Vitest hook adds a non-serializable runtime plugin", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/non-serializable-plugin"
  );

  const result = await testUtils.run(["test"], cwd);

  expect(result.status).toBe(1);
  expect(
    result.stdall.includes("contains a non-serializable Vitest value")
  ).toBeTruthy();
  expect(
    result.stdall.includes(
      "Use context.runtimePlugins for runtime Vite plugins"
    )
  ).toBeTruthy();
});

test("Creates IDE Integration files", async () => {
  const cwd = await testUtils.getCleanFixtures("crafty-preset-vitest/ide", [
    "vitest.config.crafty.mjs",
    ".vscode",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("Written vitest.config.mjs")).toBeTruthy();
  expect(result.stdall.includes("Written .vscode/settings.json")).toBeTruthy();
  expect(testUtils.readForSnapshot(cwd, "vitest.config.mjs")).toMatchSnapshot();
  expect(
    testUtils.readForSnapshot(cwd, ".vscode/settings.json")
  ).toMatchSnapshot();
});

test("Merges IDE settings into existing commented VS Code settings", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/ide-existing-settings",
    ["vitest.config.crafty.mjs", ".gitignore"]
  );

  const result = await testUtils.run(["ide"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("Written .vscode/settings.json")).toBeTruthy();
  expect(testUtils.readFile(cwd, ".vscode/settings.json")).toContain(
    "// preserve me"
  );
  expect(testUtils.readFile(cwd, ".vscode/settings.json")).toContain(
    '"editor.tabSize": 2'
  );
  expect(testUtils.readFile(cwd, ".vscode/settings.json")).toContain(
    '"vitest.rootConfig": "vitest.config.mjs"'
  );
});
