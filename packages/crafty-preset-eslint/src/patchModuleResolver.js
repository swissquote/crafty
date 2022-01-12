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

function getESLintrcFolderFromModule() {
  let currentModule = module;

  while (
    !/@eslint[\\/]eslintrc[\\/]lib[\\/]config-array-factory.js/i.test(
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
  return path.join(path.dirname(currentModule.filename), "..");
}

function patch(eslintPath) {
  console.log("Patching", eslintPath);
  const moduleResolverPath = path.join(eslintPath, "dist/eslintrc.cjs");
  const ModuleResolver = require(moduleResolverPath).Legacy.ModuleResolver;

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

// Patch @eslint/eslintrc when it's found
const eslintrcPossiblePaths = [
  getESLintrcFolderFromModule,
  () =>
    require
      .resolve("@eslint/eslintrc/package.json")
      .replace(/\/package\.json$/, ""),
  () => path.join(process.cwd(), "node_modules", "@eslint", "eslintrc")
];

eslintrcPossiblePaths.forEach(mainEslintrcFolderFn => {
  try {
    const mainEslintrcFolder = mainEslintrcFolderFn();
    if (fs.existsSync(mainEslintrcFolder)) {
      patch(mainEslintrcFolder);
      succeeded = true;
    }
  } catch (e) {
    errors.push(e);
  }
});

if (!succeeded) {
  errors.forEach(error => console.error(error));
  throw new Error(
    "Impossible to patch ESLint for module resolution. All attempts failed."
  );
}
