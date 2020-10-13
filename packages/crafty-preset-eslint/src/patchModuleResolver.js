/*
 * This files transform's ESLint's module resolver to be able to load plugins from other locations
 * The current version is only able to load dependencies relative to the current working directory.
 * Which in the case of global installations, GitHub Hooks or similar doesn't work.
 *
 * Solution inspired by https://github.com/microsoft/rushstack/tree/master/stack/eslint-patch
 *
 * This hack should be removed as soon as solutions are found in :
 * - https://github.com/eslint/eslint/issues/3458
 * - https://github.com/eslint/rfcs/pull/9
 */

const path = require("path");
const fs = require("fs");

function getFolderFromModule() {
  let currentModule = module;
  while (
    !/[\\/]eslint[\\/]lib[\\/]cli-engine[\\/]config-array-factory\.js/i.test(
      currentModule.filename
    )
  ) {
    if (!currentModule.parent) {
      // This was tested with ESLint 7.5.0; other versions may not work
      throw new Error(
        "Failed to patch ESLint because the calling module was not recognized"
      );
    }
    currentModule = currentModule.parent;
  }
  return path.join(path.dirname(currentModule.filename), "../..");
}

function checkESLintVersion(eslintPath) {
  // Detect the ESLint package version
  const eslintPackageJson = fs
    .readFileSync(path.join(eslintPath, "package.json"))
    .toString();
  const eslintPackageObject = JSON.parse(eslintPackageJson);
  const eslintPackageVersion = eslintPackageObject.version;
  const versionMatch = /^([0-9]+)\./.exec(eslintPackageVersion); // parse the SemVer MAJOR part
  if (!versionMatch) {
    throw new Error(`Unable to parse ESLint version: ${eslintPackageVersion}`);
  }
  const eslintMajorVersion = Number(versionMatch[1]);
  if (eslintMajorVersion !== 7) {
    throw new Error(
      `The patch-eslint.js script has only been tested with ESLint version 7.x. (Your version: ${eslintPackageVersion})`
    );
  }
}

function patch(eslintPath) {
  const moduleResolverPath = path.join(
    eslintPath,
    "lib/shared/relative-module-resolver"
  );
  const ModuleResolver = require(moduleResolverPath);

  const originalResolve = ModuleResolver.resolve;

  if (ModuleResolver.__patched) {
    return;
  }

  ModuleResolver.__patched = true;
  ModuleResolver.resolve = function(moduleName, relativeToPath) {
    try {
      // First check for the module relative to the current location
      return originalResolve(moduleName, __filename);
    } catch (e) {
      // OR fallback to the default behaviour of ESLint
      return originalResolve(moduleName, relativeToPath);
    }
  };
}

let succeeded = false;
const errors = [];

// Get from currently loaded module
try {
  const eslintFolder = getFolderFromModule();
  checkESLintVersion(eslintFolder);
  patch(eslintFolder);
  succeeded = true;
} catch (e) {
  errors.push(e);
}

// Get relative to this module
try {
  const relativeEslintFolder = require
    .resolve("eslint/package.json")
    .replace(/\/package\.json$/, "");
  checkESLintVersion(relativeEslintFolder);
  patch(relativeEslintFolder);
  succeeded = true;
} catch (e) {
  errors.push(e);
}

// Get relative to this module
try {
  const mainEslintFolder = path.join(process.cwd(), "node_modules", "eslint");
  if (fs.existsSync(mainEslintFolder)) {
    checkESLintVersion(mainEslintFolder);
    patch(mainEslintFolder);
    succeeded = true;
  }
} catch (e) {
  errors.push(e);
}

if (!succeeded) {
  errors.forEach((error) => console.error(error));
  throw new Error(
    "Impossible to patch ESLint for module resolution. All attempts failed."
  );
}
