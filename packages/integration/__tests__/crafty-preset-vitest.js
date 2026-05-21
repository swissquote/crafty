import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { test, expect } from "vitest";
import * as testUtils from "../utils.js";

const requireModule = createRequire(import.meta.url);
const { materializeVitestOptions, normalizeVitestOptions } = requireModule(
  "@swissquote/crafty-preset-vitest"
);

function toSonarPath(cwd, file) {
  return path.join(cwd, file).replace(/\\/g, "/");
}

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
    ["dist", "coverage", "reports"]
  );

  const result = await testUtils.run(["test", "--help"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("Usage:")).toBeTruthy();
  expect(result.stdall.includes("src/__tests__/math.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "coverage/test-report.xml")).toBeFalsy();
});

test("Shows configuration without running tests", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/succeeds",
    ["dist", "coverage", "reports"]
  );

  const result = await testUtils.run(["test", "--showConfig"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("include:")).toBeTruthy();
  expect(result.stdall.includes("reporters:")).toBeTruthy();
  expect(result.stdall.includes("src/__tests__/math.js")).toBeFalsy();
  expect(testUtils.exists(cwd, "coverage/test-report.xml")).toBeFalsy();
});

test("Shows coverage configuration with the built-in V8 provider", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/succeeds",
    ["dist", "coverage", "reports"]
  );

  const result = await testUtils.run(
    ["test", "--coverage", "--showConfig"],
    cwd
  );

  expect(result.status).toBe(0);
  expect(result.stdall.includes("provider: 'v8'")).toBeTruthy();
  expect(result.stdall.includes("'lcov'")).toBeTruthy();
  expect(testUtils.exists(cwd, "coverage/test-report.xml")).toBeFalsy();
});

test("Preserves coverage customization from the Vitest hook", () => {
  const crafty = {
    config: { destination: "dist" },
    runAllSync(name, self, options) {
      options.test.coverage = {
        reportsDirectory: "./reports/coverage",
        reporter: ["lcov"],
        thresholds: {
          lines: 90
        }
      };
    }
  };

  const options = normalizeVitestOptions(crafty, {
    runnerArgs: [],
    moduleDirectories: ["node_modules"],
    moduleFileExtensions: ["js", "json", "mjs", "cjs"],
    reporters: []
  });

  expect(options.test.coverage).toMatchObject({
    provider: "v8",
    reportsDirectory: "./reports/coverage",
    reporter: ["lcov"],
    thresholds: {
      lines: 90
    }
  });
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
    ["dist", "coverage", "reports"]
  );

  const result = await testUtils.run(["test", "--reporters", "sonar"], cwd);

  expect(result.status).toBe(0);
  expect(testUtils.exists(cwd, "coverage/test-report.xml")).toBeTruthy();
  expect(testUtils.readFile(cwd, "coverage/test-report.xml")).toContain(
    '<testExecutions version="1">'
  );
  expect(testUtils.readFile(cwd, "coverage/test-report.xml")).toContain(
    '<file path="src/__tests__/math.js">'
  );
});

test("Supports the raw Vitest Sonar reporter name with Crafty defaults", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/succeeds",
    ["dist", "coverage", "reports"]
  );

  const result = await testUtils.run(
    ["test", "--reporters", "vitest-sonar-reporter"],
    cwd
  );

  expect(result.status).toBe(0);
  expect(testUtils.exists(cwd, "coverage/test-report.xml")).toBeTruthy();
  expect(testUtils.readFile(cwd, "coverage/test-report.xml")).toContain(
    '<file path="src/__tests__/math.js">'
  );
});

test("Produces Sonar test execution and LCOV coverage artifacts with --coverage", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/succeeds",
    ["dist", "coverage", "reports"]
  );

  const result = await testUtils.run(["test", "--coverage"], cwd);

  expect(result.status).toBe(0);
  expect(testUtils.exists(cwd, "coverage/test-report.xml")).toBeTruthy();
  expect(testUtils.readFile(cwd, "coverage/test-report.xml")).toContain(
    '<testExecutions version="1">'
  );
  expect(testUtils.readFile(cwd, "coverage/test-report.xml")).toContain(
    '<file path="src/__tests__/math.js">'
  );
  expect(testUtils.exists(cwd, "coverage/lcov.info")).toBeTruthy();
  expect(testUtils.readFile(cwd, "coverage/lcov.info")).toContain("SF:");
});

test("Supports absolute Sonar file paths through the Crafty option", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/succeeds",
    ["dist", "coverage", "reports"]
  );
  const configFile = path.join(cwd, "crafty.config.js");
  const originalConfig = fs.readFileSync(configFile, "utf8");
  const expectedPath = toSonarPath(cwd, "src/__tests__/math.js");

  try {
    fs.writeFileSync(
      configFile,
      `module.exports = {
  presets: ["@swissquote/crafty-preset-vitest"],
  vitest(crafty, options) {
    options.test.reporters = [
      "default",
      ["sonar", { reportedFilePath: "absolute" }]
    ];
  }
};
`
    );

    const result = await testUtils.run(["test"], cwd);

    expect(result.status).toBe(0);
    expect(testUtils.exists(cwd, "coverage/test-report.xml")).toBeTruthy();
    expect(testUtils.readFile(cwd, "coverage/test-report.xml")).toContain(
      `<file path="${expectedPath}">`
    );
  } finally {
    fs.writeFileSync(configFile, originalConfig);
  }
});

test("Rejects raw Sonar reporter callbacks with a clear error", () => {
  const crafty = {
    config: { destination: "dist" },
    runAllSync(name, self, options) {
      options.test.reporters = [
        [
          "sonar",
          {
            onWritePath(filePath) {
              return filePath;
            }
          }
        ]
      ];
    }
  };

  expect(() =>
    normalizeVitestOptions(crafty, {
      runnerArgs: [],
      moduleDirectories: ["node_modules"],
      moduleFileExtensions: ["js", "json", "mjs", "cjs"],
      reporters: []
    })
  ).toThrow(/does not support vitest-sonar-reporter's onWritePath option/);
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
    [".vscode", ".gitignore"]
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
  expect(result.stdall.includes("Written .vscode/settings.json")).toBeFalsy();
  expect(testUtils.exists(cwd, "vitest.config.js")).toBeFalsy();
  expect(testUtils.exists(cwd, ".vscode/settings.json")).toBeFalsy();
  expect(testUtils.readForSnapshot(cwd, "vitest.config.mjs")).toMatchSnapshot();
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
    ".vscode",
    ".gitignore"
  ]);

  const result = await testUtils.run(["ide"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("Written vitest.config.mjs")).toBeTruthy();
  expect(result.stdall.includes("Written .vscode/settings.json")).toBeFalsy();
  expect(testUtils.exists(cwd, ".vscode/settings.json")).toBeFalsy();
  expect(testUtils.readForSnapshot(cwd, "vitest.config.mjs")).toMatchSnapshot();
});

const MONOREPO_IDE_GENERATED_FILES = [
  "packages/package-a/.gitignore",
  "packages/package-a/.vscode",
  "packages/package-a/vitest.config.mjs",
  "packages/package-b/.gitignore",
  "packages/package-b/.vscode",
  "packages/package-b/vitest.config.mjs"
];

test("Creates package-local Vitest IDE configs in a monorepo", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/ide-monorepo",
    MONOREPO_IDE_GENERATED_FILES
  );
  const packageADirectory = path.join(cwd, "packages", "package-a");
  const packageBDirectory = path.join(cwd, "packages", "package-b");

  const packageAResult = await testUtils.run(["ide"], packageADirectory);
  const packageBResult = await testUtils.run(["ide"], packageBDirectory);

  expect(packageAResult.status).toBe(0);
  expect(packageBResult.status).toBe(0);
  expect(testUtils.exists(cwd, "prettier.config.mjs")).toBeFalsy();
  expect(testUtils.exists(cwd, "vitest.config.mjs")).toBeFalsy();
  expect(testUtils.exists(cwd, ".vscode/settings.json")).toBeFalsy();
  expect(testUtils.exists(packageADirectory, "vitest.config.mjs")).toBeTruthy();
  expect(testUtils.exists(packageBDirectory, "vitest.config.mjs")).toBeTruthy();
  expect(
    testUtils.exists(packageADirectory, ".vscode/settings.json")
  ).toBeFalsy();
  expect(
    testUtils.exists(packageBDirectory, ".vscode/settings.json")
  ).toBeFalsy();

  const packageAVitestResult = await testUtils.runVitest(
    ["--run", "--config", "vitest.config.mjs"],
    packageADirectory
  );
  const packageBVitestResult = await testUtils.runVitest(
    ["--run", "--config", "vitest.config.mjs"],
    packageBDirectory
  );

  expect(packageAVitestResult.status).toBe(0);
  expect(packageAVitestResult.stdall).toMatch(/src\/__tests__\/package-a\.js/);
  expect(packageBVitestResult.status).toBe(0);
  expect(packageBVitestResult.stdall).toMatch(/src\/__tests__\/package-b\.ts/);
});

test("Leaves existing VS Code settings untouched", async () => {
  const cwd = await testUtils.getCleanFixtures(
    "crafty-preset-vitest/ide-existing-settings",
    [".gitignore"]
  );
  const originalSettings = testUtils.readFile(cwd, ".vscode/settings.json");

  const result = await testUtils.run(["ide"], cwd);

  expect(result.status).toBe(0);
  expect(result.stdall.includes("Written .vscode/settings.json")).toBeFalsy();
  expect(testUtils.readFile(cwd, ".vscode/settings.json")).toBe(originalSettings);
  expect(testUtils.readFile(cwd, ".vscode/settings.json")).not.toContain(
    '"vitest.rootConfig": "vitest.config.mjs"'
  );
});
