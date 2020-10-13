const fs = require("fs");
const path = require("path");
const findUp = require("find-up");

const babelRuntimePackageFile = "node_modules/@babel/runtime/package.json";

function hasBabelRuntimeDependency() {
  const packageJsonPath = findUp.sync("package.json", { cwd: process.cwd() });
  if (!packageJsonPath) {
    // If we can't find a package.json, we won't be able to know which version of the @babel/runtime we have
    return false;
  }

  const packageJson = require(packageJsonPath);
  return (
    packageJson.hasOwnProperty("dependencies") &&
    packageJson.dependencies.hasOwnProperty("@babel/runtime")
  );
}

function resolveBabelRuntimeRelativeTo(cwd) {
  const pkgRoot = findUp.sync(
    dir => {
      const testedPath = path.join(dir, babelRuntimePackageFile);

      if (fs.existsSync(testedPath)) {
        return babelRuntimePackageFile;
      }

      return null;
    },
    { cwd }
  );

  if (pkgRoot) {
    return path.dirname(pkgRoot);
  }

  return false;
}

/**
 * Check if the current module has a dependency to @babel/runtime
 * If it has it, we can add it to externals and not transpile it
 */
module.exports = function getBabelRuntimePath(bundle) {
  // If `inlineRuntime` is set to true, we won't check for its dependency
  if (bundle.inlineRuntime) {
    return false;
  }

  const hasRuntimeDependency = hasBabelRuntimeDependency();

  // If it's set to false, it is forced to keep the dependency separate.
  // we give it a chance to use the version specified in the package.json
  // Otherwise we resolve it relative to the current package, since we will need the dependency
  // to determine which version it runs with.
  if (bundle.inlineRuntime === false) {
    return resolveBabelRuntimeRelativeTo(
      hasRuntimeDependency ? process.cwd() : __dirname
    );
  }

  // If it's not forced and we don't have it, inline
  if (!hasRuntimeDependency) {
    return false;
  }

  return resolveBabelRuntimeRelativeTo(process.cwd());
};
