const { minify } = require("@swc/core");
const webpack = require("../packages/webpack");

const { name, version } = require("../package.json");

const { RawSource, SourceMapSource } = webpack.sources;

const isJsFile = /\.[cm]?js(\?.*)?$/i;

module.exports = class SwcMinifyWebpackPlugin {
  options = {
    compress: true,
    mangle: true
  };

  constructor(options) {
    Object.assign(this.options, options);
  }

  apply(compiler) {
    const pluginName = this.constructor.name;
    const meta = JSON.stringify({
      name: pluginName,
      version,
      options: this.options
    });

    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.chunkHash.tap(pluginName, (_, hash) =>
        hash.update(meta)
      );

      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage: compilation.constructor.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          additionalAssets: true
        },
        () => this.transformAssets(compilation)
      );

      compilation.hooks.statsPrinter.tap(pluginName, stats => {
        stats.hooks.print
          .for("asset.info.minimized")
          .tap(name, (minimized, { green, formatFlag }) => {
            if (minimized) {
              if (green && formatFlag) {
                return green(formatFlag("minimized"));
              } else {
                return "minimized";
              }
            } else {
              return "";
            }
          });
      });
    });
  }

  transformAssets(compilation) {
    const {
      options: { devtool }
    } = compilation.compiler;
    const sourceMap =
      this.options.sourceMap === undefined
        ? !!devtool && devtool.includes("source-map")
        : this.options.sourceMap;
    const assets = compilation
      .getAssets()
      .filter(asset => !asset.info.minimized && isJsFile.test(asset.name));

    return this.processAssets(assets, sourceMap, compilation);
  }

  async processAssets(assets, sourceMap, compilation) {
    await Promise.all(
      assets.map(async asset => {
        const { source, map } = asset.source.sourceAndMap();
        const sourceAsString = source.toString();
        const result = await minify(sourceAsString, {
          ...this.options,
          sourceMap
        });

        const newSource = sourceMap
          ? new SourceMapSource(
              result.code,
              asset.name,
              result.map,
              sourceAsString,
              map,
              true
            )
          : new RawSource(result.code);

        compilation.updateAsset(asset.name, newSource, {
          ...asset.info,
          minimized: true
        });
      })
    );
  }
};
