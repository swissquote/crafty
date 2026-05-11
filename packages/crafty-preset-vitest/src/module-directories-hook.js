const path = require("node:path");
const Module = require("node:module");
const enhancedResolve = require("@swissquote/crafty/packages/enhanced-resolve.js");
const {
  getCraftyTestResolveOptions
} = require("@swissquote/crafty/packages/test-resolve.js");

let resolveSync;
let installed = false;

function isBareImport(specifier) {
  return (
    !specifier.startsWith(".") &&
    !specifier.startsWith("/") &&
    !specifier.startsWith("\0") &&
    !/^[a-zA-Z]+:/.test(specifier)
  );
}

function getParentDirectory(parent) {
  if (parent.filename) {
    return path.dirname(parent.filename);
  }

  if (parent.path) {
    return parent.path;
  }

  return process.cwd();
}

function installModuleDirectoriesHook({ moduleDirectories, moduleFileExtensions }) {
  resolveSync = enhancedResolve.create.sync(
    getCraftyTestResolveOptions({
      conditions: ["node", "require", "default"],
      extensions: moduleFileExtensions.map(extension => `.${extension}`),
      moduleDirectories
    })
  );

  if (installed) {
    return;
  }

  installed = true;

  const originalResolveFilename = Module._resolveFilename;

  Module._resolveFilename = function resolveFilename(request, parent, ...rest) {
    try {
      return originalResolveFilename.call(this, request, parent, ...rest);
    } catch (error) {
      if (
        error.code !== "MODULE_NOT_FOUND" ||
        !parent ||
        !isBareImport(request) ||
        !resolveSync
      ) {
        throw error;
      }

      try {
        const resolved = resolveSync({}, getParentDirectory(parent), request);

        if (resolved && resolved !== false) {
          return resolved;
        }
      } catch {
        // Fall back to Node's original resolution error below.
      }

      throw error;
    }
  };
}

module.exports = {
  installModuleDirectoriesHook
};