const debug = require("debug")("webpack-runner");
const path = require("path");
const webpack = require("webpack");
const WebpackChain = require("webpack-chain");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const isGlob = require("is-glob");
const globToRegex = require("glob-to-regexp");

const PureClassesPlugin = require("./PureClassesPlugin");
const paths = require("./utils/paths");
const absolutePath = paths.absolutePath;
const absolutePaths = paths.absolutePaths;

const MODULES = path.join(__dirname, "..", "node_modules");
const APP_MODULES = path.join(process.cwd(), "node_modules");

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

  // Some default configuration
  chain
    .bail(true) // Don't attempt to continue if there are any errors.
    .devtool("source-map"); // We generate sourcemaps in production. This is slow but gives good results.

  // Add default extensions as they seem
  // to be overriden once another is added
  chain.resolve.extensions.add(".js");

  chain.resolve.modules.add("node_modules");
  chain.resolve.modules.add(APP_MODULES);
  chain.resolve.modules.add(MODULES);
  chain.resolveLoader.modules.add(APP_MODULES);
  chain.resolveLoader.modules.add(MODULES);

  // Add entries
  absolutePaths(bundle.source).forEach(source =>
    chain.entry("default").add(source)
  );

  const destination =
    config.destination_js + (bundle.directory ? "/" + bundle.directory : "");

  chain.output
    .path(absolutePath(destination)) // The build folder.
    .filename(bundle.destination) // Generated JS file names (with nested folders).
    .libraryTarget(bundle.libraryTarget || "amd") // The destination type
    .library(bundle.library || "") // The library name
    .umdNamedDefine(true); // If output.libraryTarget is set to umd and output.library is set, the amd module will be named.

  chain.externals(prepareExternals(bundle.externals));

  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }.
  chain
    .plugin("define")
    .init((Plugin, args = []) => new Plugin(args))
    .use(webpack.DefinePlugin, {
      "process.env.NODE_ENV": JSON.stringify(crafty.getEnvironment())
    });

  if (crafty.getEnvironment() === "production") {
    // Because in some cases, comments on classes are /** @class */
    // We transform them into /* @__PURE__ */ so UglifyJS is able to remove them when unused.
    chain
      .plugin("pure_classes")
      .init((Plugin, args = []) => new Plugin(args))
      .use(PureClassesPlugin, {});

    // Minify the code.only in production
    // Cloning the uglifyJS Object as webpack is mutating it which messes with other implementations
    chain
      .plugin("uglify")
      .init((Plugin, args = []) => new Plugin(args))
      .use(webpack.optimize.UglifyJsPlugin, Object.assign({}, config.uglifyJS));

    // Don't emit files if an error occured (forces to check what the error is)
    chain
      .plugin("noEmitOnError")
      .init(Plugin => new Plugin())
      .use(webpack.NoEmitOnErrorsPlugin);
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
      .init(Plugin => new Plugin())
      .use(CaseSensitivePathsPlugin);

    // Prints more readable module names
    // in the browser console on HMR updates
    chain
      .plugin("named")
      .init(Plugin => new Plugin())
      .use(webpack.NamedModulesPlugin);

    // This is necessary to emit hot updates:
    if (bundle.hot) {
      chain
        .plugin("hot")
        .init(Plugin => new Plugin())
        .use(webpack.HotModuleReplacementPlugin);

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
  }

  // Apply preset configuration
  crafty.getImplementations("webpack").forEach(preset => {
    debug(preset.presetName + ".webpack(Crafty, bundle, chain)");
    preset.webpack(crafty, bundle, chain);
    debug("added webpack");
  });

  // If --profile is passed, we create a
  // profile that we'll later write to disk
  if (process.argv.some(arg => arg === "--profile")) {
    chain.profile(true);
  }

  return chain.toConfig();
};
