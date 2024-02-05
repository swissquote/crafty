const path = require("path");
const fs = require("fs");
const rspack = require("@rspack/core");
const { RsdoctorRspackPlugin } = require("@rsdoctor/rspack-plugin");
const filesize = require("filesize");
const checkStats = require("./check-stats.js");

function createCompiler(options) {
  const nodeEnv = "production";
  process.env.NODE_ENV = nodeEnv;
  return rspack(options);
}

function printStats(stats) {
  if (stats) {
    const printedStats = stats
      .toString({ preset: "errors-warnings" })
      .replace(/Rspack compiled successfully\n?/gm, "");
    if (printedStats) {
      console.log(printedStats);
    }
  }
}

async function compile(options) {
  const compiler = createCompiler(options);
  if (!compiler) throw new Error("Could not initialize rspack");

  const allStats = await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats?.hasErrors()) {
        const buildError = err || new Error("Rspack build failed!");
        reject(buildError);

        printStats(stats);
        return;
      }

      compiler.close(() => resolve(stats));
    });
  });

  printStats(allStats);

  return allStats;
}

module.exports = async function compileRSPack(values) {
  const input = values.source;
  const output = values.destination;
  const name = values.name;

  const { externals, esm, sourceMap, sourceMapRegister, ...moreConfig } = values.options;
  if (Object.keys(moreConfig).length > 0) {
    console.log("Configuration ignored by rspack", moreConfig);
  }

  const dirname = path.dirname(output);
  const filename = path.basename(output);

  // Inspired by https://github.com/vercel/ncc/blob/main/src/index.js#L255

  const config = {
    mode: "production",
    entry: path.isAbsolute(input) ? input : `./${input}`,
    target: "node",
    experiments: {
      outputModule: true
    },
    // We first get all available stats
    // and will sort through them later
    stats: { preset: "verbose" },
    optimization: {
      minimizer: [
        // Ideally we should either not compress or pass through prettier
        // because a lot of unused code is removed by this pass
        new rspack.SwcJsMinimizerRspackPlugin({
          compress: {
            defaults: false,
            dead_code: true,
            unused: true
          },
          mangle: false,
          format: {
            comments: 'all'
          }
        }),
      ],
    },
    resolve: {
      exportsFields: ["exports"],
    },
    plugins: [
      new rspack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      // Only register the plugin when RSDOCTOR is true
      // as the plugin will increase the build time.
      process.env.RSDOCTOR === name &&
        new RsdoctorRspackPlugin(),
    ].filter(Boolean),
    output: {
      path: dirname,
      filename,
      chunkFormat: esm ? "module" : "commonjs",
      chunkFilename: `[name].[contenthash].${esm ? "mjs" : "js"}`,
      library: {
        type: esm ? "module" : "commonjs2"
      }
    }
  };

  if (externals) {
    config.externals = externals;
  }

  if (sourceMap || typeof sourceMap === "undefined") {
    config.devtool = "source-map";
  }

  if (values.extendConfig) {
    values.extendConfig(config);
  }

  const stats = await compile(config);
  const bundleStats = stats.toJson();

  for (const asset of bundleStats.assets) {
    console.log("Writing", `${dirname}/${asset.name}`, filesize(asset.size));
  }

  const bundleStatsString = JSON.stringify(bundleStats);

  const fileName = `${dirname}/${name
    .replace("@", "")
    .replace("/", "-")}-stats.json`;

  console.log("Writing", fileName);
  await fs.promises.writeFile(fileName, bundleStatsString);

  checkStats(bundleStats, fileName);
};
