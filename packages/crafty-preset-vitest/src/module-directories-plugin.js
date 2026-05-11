const path = require("node:path");
const enhancedResolve = require("@swissquote/crafty/packages/enhanced-resolve.js");
const {
  getCraftyTestResolveOptions
} = require("@swissquote/crafty/packages/test-resolve.js");

function isBareImport(specifier) {
  return (
    !specifier.startsWith(".") &&
    !specifier.startsWith("/") &&
    !specifier.startsWith("\0") &&
    !/^[a-zA-Z]+:/.test(specifier)
  );
}

function stripQueryAndHash(id) {
  return id.split("?")[0].split("#")[0];
}

module.exports = function createModuleDirectoriesPlugin({
  moduleDirectories,
  moduleFileExtensions
}) {
  const resolveSync = enhancedResolve.create.sync(
    getCraftyTestResolveOptions({
      conditions: ["node", "import", "require", "default"],
      extensions: moduleFileExtensions.map(extension => `.${extension}`),
      moduleDirectories
    })
  );

  return {
    name: "crafty-vitest-module-directories",
    async resolveId(source, importer, options) {
      if (!importer || !isBareImport(source)) {
        return null;
      }

      const resolved = await this.resolve(source, importer, {
        ...options,
        skipSelf: true
      });

      if (resolved) {
        return resolved;
      }

      const importerPath = stripQueryAndHash(importer);

      if (!path.isAbsolute(importerPath)) {
        return null;
      }

      try {
        const modulePath = resolveSync({}, path.dirname(importerPath), source);
        return modulePath === false ? null : modulePath;
      } catch {
        return null;
      }
    }
  };
};
