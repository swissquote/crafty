const path = require("path");
const fs = require("fs");
const rspack = require("@rspack/core");
const { RsdoctorRspackPlugin } = require('@rsdoctor/rspack-plugin');
const filesize = require("filesize");
const checkStats = require("./check-stats.js");

function createCompiler(options) {
  const nodeEnv = "production";
  process.env.NODE_ENV = nodeEnv;
  const config = buildConfig(options);
  return rspack(config);
}

function buildConfig(item) {
  // to set output.path
  item.output = item.output || {};

  // auto set default mode if user config don't set it
  if (!item.mode) {
    item.mode = "production";
  }

  // false is also a valid value for sourcemap, so don't override it
  if (typeof item.devtool === "undefined") {
    item.devtool = "source-map";
  }
  item.builtins = item.builtins || {};

  // Tells webpack to set process.env.NODE_ENV to a given string value.
  // optimization.nodeEnv uses DefinePlugin unless set to false.
  // optimization.nodeEnv defaults to mode if set, else falls back to 'production'.
  // See doc: https://webpack.js.org/configuration/optimization/#optimizationnodeenv
  // See source: https://github.com/webpack/webpack/blob/8241da7f1e75c5581ba535d127fa66aeb9eb2ac8/lib/WebpackOptionsApply.js#L563
  // When mode is set to 'none', optimization.nodeEnv defaults to false.
  if (item.mode !== "none") {
    (item.plugins || (item.plugins = [])).push(
      new rspack.DefinePlugin({
        // User defined `process.env.NODE_ENV` always has highest priority than default define
        "process.env.NODE_ENV": JSON.stringify(item.mode),
      })
    );
  }

  item.stats = { preset: "verbose" };

  return item;
}

async function compile(options) {
  const compiler = createCompiler(options);
  if (!compiler) throw new Error("Could not initialize rspack");

  const { stats } = await new Promise(
    (resolve, reject) => {
      compiler.run((err, stats) => {
        if (err || stats?.hasErrors()) {
          const buildError = err || new Error('Rspack build failed!');
          reject(buildError);
          return
        }

        compiler.close(() => resolve({ stats }));
        
      });
    },
  );

  const printedStats = stats.toString({ preset: "errors-warnings" });
  if (printedStats) {
    console.log(printedStats);
  }

  return stats;

}

module.exports = async function compileRSPack(input, output, bundle) {
  const { name, externals, esm, ...moreConfig } = bundle;
  if (Object.keys(moreConfig).length > 0) {
    console.log("Configuration ignored by rspack", moreConfig);
  }

  const dirname = path.dirname(output);
  const filename = path.basename(output);

  const config = {
    entry: path.isAbsolute(input) ? input : `./${input}`,
    target: "node",
    experiments: {
      outputModule: true
    },
    externals,
    optimization: {
      minimize: false
    },
    plugins: [
      // Only register the plugin when RSDOCTOR is true, as the plugin will increase the build time.
      process.env.RSDOCTOR &&
        new RsdoctorRspackPlugin(),
    ].filter(Boolean),
    output: {
      path: dirname,
      filename: filename,
      chunkFormat: esm ? 'module' : 'commonjs',
      chunkFilename: `[name].[contenthash].${esm ? 'mjs' : 'js'}`,
      library: {
        type: esm ? 'module' : 'commonjs2'
      }
    },
  };

  const stats = await compile(config);
  const bundleStats = stats.toJson();

  for (const asset of bundleStats.assets) {
    console.log(
      "Writing",
      `${dirname}/${asset.name}`,
      filesize(asset.size)
    );
  }

  const bundleStatsString = JSON.stringify(bundleStats);

  const fileName = `${dirname}/${name
    .replace("@", "")
    .replace("/", "-")}-stats.json`;

  console.log("Writing", fileName);
  await fs.promises.writeFile(fileName, bundleStatsString);

  checkStats(bundleStats, fileName);
}
