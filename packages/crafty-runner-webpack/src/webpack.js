const crypto = require("crypto");
const debug = require("debug")("crafty:runner-webpack");
const path = require("path");
const fs = require("fs");
const WebpackChain = require("webpack-chain");
const isGlob = require("is-glob");
const globToRegex = require("glob-to-regexp");
const paths = require("./utils/paths");

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
 * Because if multiple webpack bundles are loaded at the same time
 * they might conflict
 *
 * @param {Boolean} isWatching
 * @param {Bundle} bundle
 */
function generateJsonpName(isWatching, bundle) {
  // For testing we need to pre-hardcode it
  // If we don't, the minification will have weird effects
  if (process.env.TESTING_CRAFTY) {
    return "webpackJsonp_UNIQID";
  }

  let name;
  if (isWatching) {
    // Use a name that is reproducible in watch mode
    // This mode just needs a hash that is different enough
    name = `${process.cwd()}-${bundle.taskName}`;
  } else {
    // In production mode, we want this id to be as unique as possible
    name =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
  }

  const hashed = crypto
    .createHash("sha1")
    .update(name)
    .digest("hex")
    .substring(0, 8);

  return `webpackJsonp_${hashed}`;
}

function configureWatcher(chain, bundle, config, webpackPort) {
  // Don't finish early in case of errors in development.
  chain.bail(false);
  chain.devtool("cheap-module-source-map");

  // Watcher doesn't work well if you mistype casing in a path so we use
  // a plugin that prints an error when you attempt to do this.
  // See https://github.com/facebookincubator/create-react-app/issues/240
  chain
    .plugin("case-sensitive")
    .use(require.resolve("case-sensitive-paths-webpack-plugin"));

  const outputPath = `${chain.output.get("path").replace(/\/$/g, "")}/**`;

  // Ignore the default dist folder as otherwise
  // webpack can enter a rebuild loop
  chain
    .plugin("WatchIgnorePlugin")
    .use(require.resolve("webpack/lib/WatchIgnorePlugin"), [
      [/\.d\.ts$/, outputPath]
    ]);

  // Ignore the default dist folder as otherwise
  // webpack can enter a rebuild loop
  chain.watchOptions({
    ignored: ["node_modules", outputPath]
  });

  chain.devServer
    .hot(bundle.hot ? "only" : false)
    .host("localhost")
    .port(webpackPort)
    .set("devMiddleware", {
      stats: false,
      writeToDisk: true
    })
    .set("static", {
      directory: config.destination,
      watch: false
    })
    .headers({
      "Access-Control-Allow-Origin": "*"
    });
}

function configureProfiling(chain, bundle) {
  chain.profile(true);

  chain
    .plugin("bundle-analyzer")
    .init((Plugin, args) => new Plugin.BundleAnalyzerPlugin(...args))
    .use(require.resolve("webpack-bundle-analyzer"), [
      {
        analyzerMode: "static",
        openAnalyzer: false,
        reportFilename: `${bundle.name}_report.html`,
        generateStatsFile: true,
        statsFilename: `${bundle.name}_stats.json`
      }
    ]);

  chain
    .plugin("inspectpack")
    .init((Plugin, args) => new Plugin.DuplicatesPlugin(...args))
    .use(require.resolve("inspectpack/plugin"), [{}]);
}

function finalizeWatcher(chain) {
  // Read theses values from webpack chain as they could have been overriden with a preset
  const protocol = chain.devServer.get("https") ? "https" : "http";
  const host = chain.devServer.get("host");
  const port = chain.devServer.get("port");
  const urlPrefix = `${protocol}://${host}:${port}`;

  // Setting the public path to find the compiled assets,
  // only if it hasn't already been set
  const definedPublicPath = chain.output.get("publicPath");
  if (!definedPublicPath) {
    const contentBase = chain.devServer.get("contentBase");
    const outputPath = chain.output.get("path");
    const publicPath = outputPath.replace(contentBase, "").replace(/^\//, "");
    chain.output.publicPath(`${urlPrefix}/${publicPath}/`);
  }
}

module.exports = function(crafty, bundle, webpackPort) {
  const config = crafty.config;
  const isWatching = crafty.isWatching();
  const chain = new WebpackChain();

  // Define webpack's mode, will enable some default configurations
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

  chain.output
    .path(absolutePath(destination)) // The build folder.
    .filename(bundle.destination) // Generated JS file names (with nested folders).
    .chunkFilename(`[name].${bundle.destination}`)
    .libraryTarget(bundle.libraryTarget || "umd") // The destination type
    .library(bundle.library || "") // The library name
    .jsonpFunction(generateJsonpName(isWatching, bundle)); // TODO :: change that

  chain.externals(prepareExternals(bundle.externals));

  // Enable support for Yarn PNP
  const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
  chain.resolve
    .plugin("pnp-webpack-plugin")
    // Cloning the plugin exports as this would otherwise
    // fail with `Cannot redefine property: __pluginArgs`
    .init(Plugin => ({ ...Plugin }))
    .use(PnpWebpackPlugin);

  chain.resolveLoader
    .plugin("pnp-webpack-plugin")
    .init(Plugin => Plugin.moduleLoader(module))
    .use(PnpWebpackPlugin);

  // Minimization is enabled only in production but we still
  // define it here in case someone needs to minify in development.
  // We are Cloning the Terser configuration Object as webpack
  // mutates it which messes with other implementations
  chain.optimization
    .minimizer("terser")
    .use(require.resolve("terser-webpack-plugin"), [
      {
        sourceMap: true,
        terserOptions: { ...config.terser }
      }
    ]);

  if (crafty.getEnvironment() === "production") {
    // Don't emit files if an error occured (forces to check what the error is)
    chain.optimization.noEmitOnErrors(true);
  }

  // Hot Reloading
  if (crafty.getEnvironment() !== "production" && isWatching) {
    configureWatcher(chain, bundle, config, webpackPort);
  }

  // If --profile is passed, we create a
  // profile that we'll later write to disk
  if (process.argv.some(arg => arg === "--profile")) {
    configureProfiling(chain, bundle);
  }

  // Apply preset configuration
  crafty.getImplementations("webpack").forEach(preset => {
    debug(`${preset.presetName}.webpack(Crafty, bundle, chain)`);
    preset.webpack(crafty, bundle, chain);
    debug("added webpack");
  });

  // If we're in watch mode, there are some settings we have to
  // cleanly apply at the end of the configuration process
  if (crafty.getEnvironment() !== "production" && isWatching && bundle.hot) {
    finalizeWatcher(chain);
  }

  return chain.toConfig();
};
