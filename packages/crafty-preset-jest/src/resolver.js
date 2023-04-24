// This is a fork of https://github.com/mlrawlings/enhanced-resolve-jest
// All credits go to the original creators of this resolver
// This fork allows to use the latest version of enhanced-resolve

const fs = require("fs");
const {
  ResolverFactory,
  CachedInputFileSystem
} = require("@swissquote/crafty/packages/enhanced-resolve.js");

const EMPTY_FILE = require.resolve("./resolver-empty");

/**
 * @type {CreateResolver} {typeof ResolverFactory.createResolver}
 */

/**
 * @typedef {typeof ResolverFactory.createResolver} CreateResolver
 */

/**
 * @typedef {ReturnType<CreateResolver>} Resolver
 */

/**
 * @typedef {Parameters<CreateResolver>[0]} ResolverOpts
 */

/**
 * @typedef {Parameters<typeof import("jest-resolve/build/defaultResolver").default>[1]} JestResolverOpts
 */

/**
 * @typedef {Pick<JestResolveOpts, "browser" | "extensions" | "moduleDirectory">} getConfigOpts
 */

const cachedInputFileSystem = new CachedInputFileSystem(fs, 60000);
let queuedPurge = false;
//export default module.exports = exports = create(getDefaultConfig);

/**
 *
 * @param {(opts: getConfigOpts) => ResolverOpts} getConfig
 * @returns {(modulePath: string, jestOpts: JestResolveOpts) => string}
 */
function create(getConfig) {
  const resolverCache = Object.create(null);
  return (modulePath, jestOpts) => {
    if (!queuedPurge) {
      queuedPurge = true;
      setImmediate(() => {
        cachedInputFileSystem.purge();
        queuedPurge = false;
      });
    }

    const configOpts = {
      browser: jestOpts.browser,
      extensions: jestOpts.extensions,
      moduleDirectory: jestOpts.moduleDirectory,
      conditions: jestOpts.conditions
    };

    const userConfig = getConfig(configOpts);
    const cacheKey = `${configOpts.browser}\0${jestOpts.extensions}\0${configOpts.moduleDirectory}`;
    const resolver =
      resolverCache[cacheKey] ||
      (resolverCache[cacheKey] = ResolverFactory.createResolver({
        fileSystem: cachedInputFileSystem,
        ...userConfig,
        useSyncFileSystemCalls: true
      }));

    const resolved = resolver.resolveSync({}, jestOpts.basedir, modulePath);

    if (resolved === false) {
      return EMPTY_FILE;
    }

    return resolved;
  };
}

/**
 *
 * @param {getConfigOpts} opts
 * @returns ResolverOpts
 */
function getDefaultConfig(opts) {
  return {
    symlinks: true,
    extensions: opts.extensions,
    modules: opts.moduleDirectory,
    conditionNames: opts.conditions,
    fileSystem: fs,
    ...(opts.browser
      ? {
          aliasFields: ["browser"],
          mainFields: ["browser", "main"]
        }
      : {})
  };
}

module.exports = create(jestConfig => {
  // Expected to return all options for
  // https://github.com/webpack/enhanced-resolve#resolver-options

  // You can get a config with the same options as the default resolver like so.
  const baseConfig = getDefaultConfig(jestConfig);

  // These aliases are defined even without the existence of the TypeScripts preset
  // this is because we can't define it from the TypeScript preset
  baseConfig.extensionAlias = {
    ".js": [".js", ".ts"],
    ".cjs": [".cjs", ".cts"],
    ".mjs": [".mjs", ".mts"]
  };

  return baseConfig;
});
