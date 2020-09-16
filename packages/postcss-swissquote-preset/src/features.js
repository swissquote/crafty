const ChainedMap = require("./ChainedMap");
const Processor = require("./Processor");

class ProcessorMap extends ChainedMap {
  /**
   * Create a processor, returns the existing one if there is already one with the same name
   *
   * @param {string} name The name of the module that provides this feature
   * @returns {Processor}
   */
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
  processors
    .processor("postcss-custom-properties")
    .enableIfUnsupported(["css-variables"], config.browsers)
    .setOptions({
      preserve: false,
      appendVariables: true
    })
    .before("postcss-calc");

  processors.processor("postcss-calc");

  processors
    .processor("postcss-image-set-polyfill")
    .enableIfUnsupported(["css-image-set"], config.browsers);

  processors.processor("postcss-nesting");

  processors.processor("postcss-custom-media");
  processors.processor("postcss-media-minmax");

  processors.processor("postcss-custom-selectors");

  processors
    .processor("postcss-attribute-case-insensitive")
    .enableIfUnsupported(["css-case-insensitive"], config.browsers);

  processors
    .processor("postcss-color-rebeccapurple")
    .enableIfUnsupported(["css-rebeccapurple"], config.browsers);

  processors.processor("postcss-color-hwb");
  processors.processor("postcss-color-hsl");
  processors.processor("postcss-color-rgb");
  processors.processor("postcss-color-gray");

  processors
    .processor("postcss-color-hex-alpha")
    .enableIfUnsupported(["css-rrggbbaa"], config.browsers);

  processors.processor("postcss-color-function");

  processors.processor("postcss-font-family-system-ui");

  processors.processor("postcss-font-variant");

  processors
    .processor("pleeease-filters")
    .enableIfUnsupported(["css-filters"], config.browsers);

  processors
    .processor("postcss-initial")
    .enableIfUnsupported(["css-all", "css-initial-value"], config.browsers);

  processors
    .processor("pixrem")
    .setOptions({ browsers: config.browsers })
    .enableIfUnsupported(["rem"], config.browsers);

  processors
    .processor("postcss-pseudoelements")
    .enableIfUnsupported(["css-gencontent"], config.browsers);

  processors
    .processor("postcss-selector-matches")
    .enableIfUnsupported(["css-matches-pseudo"], config.browsers);

  processors
    .processor("postcss-selector-not")
    .enableIfUnsupported(["css-not-sel-list"], config.browsers);

  processors.processor("postcss-pseudo-class-any-link");

  processors
    .processor("postcss-color-rgba-fallback")
    .enableIfUnsupported(["css3-colors"], config.browsers);

  processors
    .processor("postcss-replace-overflow-wrap")
    .enableIfUnsupported(["wordwrap"], config.browsers);

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
    overrideBrowserslist: config.browsers
  });

  // CSSO :: Minify and Optimize CSS
  processors.processor("postcss-csso").enableIf(() => env === "production");

  // Report problems encountered during build
  processors.processor("postcss-reporter").setOptions({
    clearReportedMessages: true
  });

  // List the used plugins (sends output to debug)
  processors
    .processor("plugin-list")
    .module(require.resolve("./postcss-plugin-list"));

  return processors;
};
