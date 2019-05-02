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
    config.destination_js + (bundle.directory ? "/" + bundle.directory : "");

  chain.output
    .path(absolutePath(destination)) // The build folder.
    .filename(bundle.destination) // Generated JS file names (with nested folders).
    .libraryTarget(bundle.libraryTarget || "umd") // The destination type
    .library(bundle.library || ""); // The library name

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
  // We are Cloning the uglifyJS Object as webpack
  // mutates it which messes with other implementations
  chain.optimization
    .minimizer("uglify")
    .use(require.resolve("terser-webpack-plugin"), [
      {
        sourceMap: true,
        terserOptions: Object.assign({}, config.uglifyJS)
      }
    ]);

  if (crafty.getEnvironment() === "production") {
    // Because in some cases, comments on classes are /** @class */
    // We transform them into /* @__PURE__ */ so UglifyJS is able to remove them when unused.
    chain.plugin("pure_classes").use(require.resolve("./PureClassesPlugin"));

    // Don't emit files if an error occured (forces to check what the error is)
    chain.optimization.noEmitOnErrors(true);
  }

  // Hot Reloading
  if (crafty.getEnvironment() !== "production" && isWatching) {
    // Don't finish early in case of errors in development.
    chain.bail(false);
    chain.devtool("cheap-module-source-map");

    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    chain
      .plugin("case-sensitive")
      .use(require.resolve("case-sensitive-paths-webpack-plugin"));

    // This is necessary to emit hot updates:
    if (bundle.hot) {
      chain
        .plugin("hot")
        .use(require.resolve("webpack/lib/HotModuleReplacementPlugin"));

      chain
        .entry("default")
        .prepend(
          require.resolve("./webpack_utils/webpack_url.js") +
            `?http://localhost:${webpackPort}`
        ) // Patch webpack lookup URL
        .prepend(
          require.resolve("webpack-dev-server/client") +
            `?http://localhost:${webpackPort}`
        ) // WebpackDevServer host and port
        .prepend(require.resolve("webpack/hot/only-dev-server")); // "only" prevents reload on syntax errors
    }

    chain.devServer
      .hot(bundle.hot)
      .host("localhost")
      .port(webpackPort)
      .hotOnly(true)
      .stats(false)
      .contentBase(config.destination)
      .headers({
        "Access-Control-Allow-Origin": "*"
      });
  }

  // If --profile is passed, we create a
  // profile that we'll later write to disk
  if (process.argv.some(arg => arg === "--profile")) {
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

  // Apply preset configuration
  crafty.getImplementations("webpack").forEach(preset => {
    debug(preset.presetName + ".webpack(Crafty, bundle, chain)");
    preset.webpack(crafty, bundle, chain);
    debug("added webpack");
  });

  return chain.toConfig();
};
