const ChainedMap = require("./src/ChainedMap");
const Processor = require("./src/Processor");

class ProcessorMap extends ChainedMap {
  processor(name) {
    return this.getOrCompute(name, () => new Processor(name));
  }
}

module.exports = function(config) {
  const env = config.environment || process.env.NODE_ENV || "production";

  // All processors used to make the CSS readable by a browser
  const processors = new ProcessorMap();

  // Handle @import and rebase urls
  processors.processor("postcss-import");
  processors.processor("postcss-url").setOptions({ url: "rebase" });

  // Apply Sass-like features
  processors
    .processor("postcss-advanced-variables")
    .setOptions({ disable: "@import" });
  processors.processor("postcss-atroot");
  processors.processor("postcss-property-lookup");

  // Add plugins from postcss-preset-env missing in postcss-cssnext
  processors.processor("postcss-dir-pseudo-class");
  processors.processor("postcss-logical");

  // Handle next generation features
  const cssnextOptions = {
    browsers: config.browsers,
    features: {}
  };
  processors
    .processor("postcss-cssnext")
    .module(require.resolve("./src/cssnext"))
    .setOptions(cssnextOptions);

  // Also support sass-style nesting
  processors.processor("postcss-nested");

  // Handle asset variables resolving
  processors.processor("postcss-assets").setOptions({
    cachebuster: true,
    loadPaths: ["images"],
    relative: true
  });

  // Only add postcss-opacity and postcss-filter-gradient if old IE needs to be supported
  processors.processor("postcss-filter-gradient").enableIf(() => {
    const list = require("browserslist")(config.browsers);

    return (
      list.indexOf("ie 9") >= 0 ||
      list.indexOf("ie 8") >= 0 ||
      list.indexOf("ie 7") >= 0 ||
      list.indexOf("ie 6") >= 0
    );
  });

  // Options to apply to autoprefixer
  processors.processor("autoprefixer").setOptions({
    browsers: config.browsers
  });

  // CSSO :: Minify and Optimize CSS
  processors
    .processor("postcss-csso")
    .enableIf(() => env === "production");

  // Report problems encountered during build
  processors.processor("postcss-reporter").setOptions({
    clearReportedMessages: true
  });

  // List the used plugins (sends output to debug)
  processors
    .processor("plugin-list")
    .module(require.resolve("./src/postcss-plugin-list"));

  return processors
    .values()
    .filter(item => item.isEnabled())
    .map(item => item.instantiate());
};
