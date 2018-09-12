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
  processors.processor("postcss-import").module(options => require("postcss-import")(options));
  processors.processor("postcss-url").module(options => require("postcss-url")(options), { url: "rebase" });

  // Apply Sass-like features
  const variablesOptions = { disable: "@import" };
  processors.processor("postcss-advanced-variables").module(options => require("postcss-advanced-variables")(options), variablesOptions);
  processors.processor("postcss-atroot").module(options => require("postcss-atroot")(options));
  processors.processor("postcss-property-lookup").module(options => require("postcss-property-lookup")(options));

  // Add plugins from postcss-preset-env missing in postcss-cssnext
  processors.processor("postcss-dir-pseudo-class").module(options => require("postcss-dir-pseudo-class")(options));
  processors.processor("postcss-logical").module(options => require("postcss-logical")(options));

  // Handle next generation features
  const cssnextOptions = {
    browsers: config.browsers,
    features: {}
  };
  processors.processor("postcss-cssnext").module(options => require("./src/cssnext")(options), cssnextOptions);

  // Also support sass-style nesting
  processors.processor("postcss-nested").module(options => require("postcss-nested")(options));

  // Handle asset variables resolving
  const assetsOptions = {
    cachebuster: true,
    loadPaths: ["images"],
    relative: true
  };
  processors.processor("postcss-assets").module(options => require("postcss-assets")(options), assetsOptions);

  // Only add postcss-opacity and postcss-filter-gradient if old IE needs to be supported
  const list = require("browserslist")(config.browsers);
  if (
    list.indexOf("ie 9") >= 0 ||
    list.indexOf("ie 8") >= 0 ||
    list.indexOf("ie 7") >= 0 ||
    list.indexOf("ie 6") >= 0
  ) {
    processors.processor("postcss-filter-gradient").module(options => require("postcss-filter-gradient")(options));
  }

  // Options to apply to autoprefixer
  const autoprefixerOptions = {
    browsers: config.browsers
  };
  processors.processor("autoprefixer").module(options => require("autoprefixer")(options), autoprefixerOptions);

  // CSSO :: Minify and Optimize CSS
  if (env === "production") {
    processors.processor("postcss-csso").module(options => require("postcss-csso")(options));
  }

  // Report problems encountered during build
  const reporterOptions = {
    clearReportedMessages: true
  };
  processors.processor("postcss-reporter").module(options => require("postcss-reporter")(options), reporterOptions);

  // List the used plugins (sends output to debug)
  processors.processor("plugin-list").module(options => require("./src/postcss-plugin-list"));

  return processors.values().map(item => item.instantiate());
};
