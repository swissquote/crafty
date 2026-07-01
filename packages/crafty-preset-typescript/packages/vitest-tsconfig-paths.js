const path = require("node:path");
const fs = require("node:fs");
const enhancedResolve = require("@swissquote/crafty/packages/enhanced-resolve.js");

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

// Vite/Vitest plugin resolving imports through the `paths`/`baseUrl` mapping
// of a tsconfig.json, using the same enhanced-resolve engine (and semantics)
// as the webpack, rspack and Jest integrations.
module.exports = function createTsconfigPathsPlugin({ tsconfig, extensions }) {
  const resolveSync = enhancedResolve.create.sync({
    fileSystem: fs,
    useSyncFileSystemCalls: true,
    conditionNames: ["node", "import", "require", "default"],
    extensions: [...new Set(extensions || [])],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"]
    },
    tsconfig: {
      configFile: tsconfig,
      references: "auto"
    }
  });

  return {
    name: "crafty-vitest-tsconfig-paths",
    async resolveId(source, importer, options) {
      if (!importer || !isBareImport(source)) {
        return null;
      }

      // Let Vite resolve real packages first; only fall back to the tsconfig
      // mapping when the specifier isn't a regular module.
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
