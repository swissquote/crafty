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

const path = require('path');
const fs = require('fs');
let currentModule = module;
while (!/[\\/]eslint[\\/]lib[\\/]cli-engine[\\/]config-array-factory\.js/i.test(currentModule.filename)) {
    if (!currentModule.parent) {
        // This was tested with ESLint 7.5.0; other versions may not work
        throw new Error('Failed to patch ESLint because the calling module was not recognized');
    }
    currentModule = currentModule.parent;
}
const eslintFolder = path.join(path.dirname(currentModule.filename), '../..');
// Detect the ESLint package version
const eslintPackageJson = fs.readFileSync(path.join(eslintFolder, 'package.json')).toString();
const eslintPackageObject = JSON.parse(eslintPackageJson);
const eslintPackageVersion = eslintPackageObject.version;
const versionMatch = /^([0-9]+)\./.exec(eslintPackageVersion); // parse the SemVer MAJOR part
if (!versionMatch) {
    throw new Error('Unable to parse ESLint version: ' + eslintPackageVersion);
}
const eslintMajorVersion = Number(versionMatch[1]);
if (!(eslintMajorVersion === 7)) {
    throw new Error('The patch-eslint.js script has only been tested with ESLint version 7.x. (Your version: ' +
        eslintPackageVersion +
        ')');
}

const moduleResolverPath = path.join(eslintFolder, 'lib/shared/relative-module-resolver');
const ModuleResolver = require(moduleResolverPath);

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
