const crypto = require("node:crypto");
const path = require("node:path");
const fs = require("node:fs");
const RspackChain = require("../packages/rspack-chain.js").default;
const ancestor = require("../packages/common-ancestor-path.js");
const isGlob = require("../packages/is-glob.js");
const globToRegex = require("../packages/glob-to-regexp.js");
const paths = require("./utils/paths.js");

const absolutePath = paths.absolutePath;
const absolutePaths = paths.absolutePaths;

function prepareExternals(externals) {
  if (!externals || externals.length === 0) {
    return [];
  }

  return externals.map(external => {
    if (typeof external !== "string" || !isGlob(external)) {
      return external;
    }

    return globToRegex(external);
  });
}

/**
 * The jsonp function is used to load async chunks
 * We generate a name that is as unique as possible
 * Because if multiple webpack/Rspack bundles are loaded at the same time
 * they might conflict
 *
 * @param {Boolean} isWatching
 * @param {Bundle} bundle
 */
function uniqueName(isWatching, bundle) {
  // For testing we need to pre-hardcode it
  // If we don't, the minification will have weird effects
  if (process.env.TESTING_CRAFTY) {
    return "UNIQID";
  }

  let name;
  if (isWatching) {
    // Use a name that is reproducible in watch mode
    // This mode just needs a hash that is different enough
    name = `${process.cwd()}-${bundle.taskName}`;
  } else {
    // In production mode, we want this id to be as unique as possible
    // TODO :: maybe in the future this could be changed to a more predictible name as caching will be affected by it
    name =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
  }

  return crypto
    .createHash("sha1")
    .update(name)
    .digest("hex")
    .substring(0, 8);
}

function configureWatcher(chain, bundle, config, rspackPort) {
  // Don't finish early in case of errors in development.
  chain.bail(false);
  chain.devtool("cheap-module-source-map");

  // Watcher doesn't work well if you mistype casing in a path so we use
  // a plugin that prints an error when you attempt to do this.
  // See https://github.com/facebookincubator/create-react-app/issues/240
  chain
    .plugin("case-sensitive")
    .init(
      (Plugin, args) =>
        new Plugin.rspack.WarnCaseSensitiveModulesPlugin(...args)
    )
    .use(require.resolve("@rspack/core"));

  const outputPath = `${chain.output.get("path").replace(/\/$/g, "")}/**`;

  // Ignore the default dist folder as otherwise
  // Rspack can enter a rebuild loop
  chain.watchOptions({
    ignored: ["node_modules", /\.d\.ts$/, outputPath]
  });

  chain.devServer
    .host("localhost")
    .port(rspackPort)
    .headers({
      "Access-Control-Allow-Origin": "*"
    });
}

function finalizeWatcher(chain, config) {
  const {
    host,
    port,
    middleware,
    headers,
    ...devServerConfig
  } = chain.devServer.toConfig();

  // Read theses values from Rspack chain as they could have been overriden with a preset
  const protocol = chain.devServer.get("https") ? "https" : "http";
  const urlPrefix = `${protocol}://${host}:${port}`;

  let staticPath = config.destination;

  // Setting the public path to find the compiled assets,
  // only if it hasn't already been set
  const definedPublicPath = chain.output.get("publicPath");
  if (!definedPublicPath) {
    const outputPath = chain.output.get("path");
    const cwd = process.cwd();

    // Since the target can be outside of current working directory (where the source is)
    // the easiest to have access to the files is to expose the common ancestor
    const commonAncestor = ancestor(outputPath, cwd);
    staticPath = commonAncestor;

    const publicPath = outputPath
      .replace(commonAncestor, "")
      .replace(/^\//, "");

    chain.output.publicPath(`${urlPrefix}/${publicPath}/`);
  }

  chain
    .entry("default")
    .prepend(require.resolve("anypack-plugin-serve/client"));

  chain
    .plugin("AnypackPluginServe")
    .init((Plugin, args) => new Plugin.AnypackPluginServe(...args))
    .use(require.resolve("anypack-plugin-serve"), [
      {
        ...devServerConfig,
        host,
        port,

        // publicPath is appended to static path by default
        // since we use a custom `publicPath` with an http prefix
        // setting an empty publicPath will just use static
        publicPath: "",
        static: staticPath,

        // We want to start more than one server at a time
        allowMany: true,

        middleware: (app, builtins) => {
          if (headers) {
            builtins.headers(headers);
          }

          if (middleware) {
            middleware(app, builtins);
          }
        }
      }
    ]);
}

module.exports = function configureRspack(crafty, bundle, serverPort) {
  const config = crafty.config;
  const isWatching = crafty.isWatching();
  const chain = new RspackChain();

  // Define Rspack's mode, will enable some default configurations
  chain.mode(
    crafty.getEnvironment() === "production" ? "production" : "development"
  );

  // Don't attempt to continue if there are any errors.
  chain.bail(true);

  // We generate sourcemaps in production. This is slow but gives good results.
  chain.devtool("source-map");

  // Add default extensions as they seem
  // to be overriden once another is added
  chain.resolve.extensions.add(".js");

  chain.resolve.modules.add("node_modules");

  [
    path.join(process.cwd(), "node_modules"),
    path.join(__dirname, "..", "node_modules"),
    path.join(__dirname, "..", "..", "..", "node_modules")
  ]
    .filter(fs.existsSync)
    .forEach(dir => {
      chain.resolve.modules.add(dir);
      chain.resolveLoader.modules.add(dir);
    });

  // Add entries
  absolutePaths(bundle.source).forEach(source =>
    chain.entry("default").add(source)
  );

  const destination =
    config.destination_js + (bundle.directory ? `/${bundle.directory}` : "");

  // Automatically use the most up-to-date syntax by leveraging Browerslist
  // TODO :: this feature doesn't work yet as IE 11 is detected as supporting ES6 which is incorrect
  //chain.set("target", `browserslist:${config.browsers}`);
  chain.set("target", ["web", "es5"]);

  chain.output
    .path(absolutePath(destination)) // The build folder.
    .filename(bundle.destination) // Generated JS file names (with nested folders).
    .chunkFilename(`[name].${bundle.destination}`)
    .libraryTarget(bundle.libraryTarget || "umd") // The destination type
    .set("uniqueName", uniqueName(isWatching, bundle));

  if (bundle.library) {
    chain.output.library(bundle.library); // The library name
  }

  chain.externals(prepareExternals(bundle.externals));

  // Minimization is enabled only in production but we still
  // define it here in case someone needs to minify in development.
  chain.optimization
    .minimizer("swc")
    .init(
      (Plugin, args) => new Plugin.rspack.SwcJsMinimizerRspackPlugin(...args)
    )
    .use(require.resolve("@rspack/core"), [
      {
        compress: true,
        mangle: true
      }
    ]);

  if (crafty.getEnvironment() === "production") {
    // Don't emit files if an error occured (forces to check what the error is)
    chain.optimization.set("emitOnErrors", false);
  }

  // Hot Reloading
  if (crafty.getEnvironment() !== "production" && isWatching) {
    configureWatcher(chain, bundle, config, serverPort);
  }

  // Apply preset configuration
  crafty.runAllSync("rspack", crafty, bundle, chain);

  // If we're in watch mode, there are some settings we have to
  // cleanly apply at the end of the configuration process
  if (crafty.getEnvironment() !== "production" && isWatching) {
    finalizeWatcher(chain, config);
  }

  // RsDoctor doest the job of both --profile and --analyze
  if (process.argv.some(arg => arg === "--profile" || arg === "--analyze")) {
    const verbose = process.argv.some(arg => arg === "--verbose");

    chain.profile(true);

    chain
      .plugin("RsdoctorRspackPlugin")
      .init((Plugin, args) => new Plugin.RsdoctorRspackPlugin(...args))
      .use(require.resolve("@rsdoctor/rspack-plugin"), [
        {
          // https://rsdoctor.rs/config/options/options
          disableClientServer: true,
          output: {
            mode: verbose ? "normal" : "brief",

            options: {
              type: ["html", "json"],
              htmlOptions: {
                reportHtmlName: `${bundle.name}_rsdoctor.html`,
                writeDataJson: true
              },
              jsonOptions: {
                fileName: `${bundle.name}_stats.json`
              }
            }
          }
        }
      ]);
  }

  return chain.toConfig();
};
