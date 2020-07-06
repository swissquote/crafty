/*
 * This files transform's ESLint's module resolver to be able to load plugins from other locations
 * The current version is only able to load dependencies relative to the current working directory.
 * Which in the case of global installations, GitHub Hooks or similar doesn't work.
 *
 * This hack should be removed as soon as solutions are found in :
 * - https://github.com/eslint/eslint/issues/3458
 * - https://github.com/eslint/rfcs/pull/9
 */


const ModuleResolver = require("eslint/lib/shared/relative-module-resolver");

const originalResolve = ModuleResolver.resolve;

ModuleResolver.resolve = function(moduleName, relativeToPath) {
  try {
    // First check for the module relative to the current location
    return originalResolve(moduleName, __filename);
  } catch (e) {
    // OR fallback to the default behaviour of ESLint
    return originalResolve(moduleName, relativeToPath);
  }
};
