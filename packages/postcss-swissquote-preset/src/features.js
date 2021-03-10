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
  processors.processor("postcss-import").embedded();
  processors
    .processor("postcss-url")
    .embedded()
    .setOptions({ url: "rebase" });

  // Apply Sass-like features
  processors
    .processor("postcss-advanced-variables")
    .embedded()
    .setOptions({ disable: "@import" });
  processors.processor("postcss-atroot").embedded();
  processors.processor("postcss-property-lookup").embedded();

  // Add plugins from postcss-preset-env missing in postcss-cssnext
  processors.processor("postcss-dir-pseudo-class").embedded();
  processors.processor("postcss-logical").embedded();

  // Handle next generation features
  processors
    .processor("postcss-custom-properties")
    .embedded()
    .enableIfUnsupported(["css-variables"], config.browsers)
    .setOptions({
      preserve: false,
      appendVariables: true
    })
    .before("postcss-calc");

  processors.processor("postcss-calc").embedded();

  processors
    .processor("postcss-image-set-polyfill")
    .embedded()
    .enableIfUnsupported(["css-image-set"], config.browsers);

  processors.processor("postcss-nesting").embedded();

  processors.processor("postcss-custom-media").embedded();
  processors.processor("postcss-media-minmax").embedded();

  processors.processor("postcss-custom-selectors").embedded();

  processors
    .processor("postcss-attribute-case-insensitive")
    .embedded()
    .enableIfUnsupported(["css-case-insensitive"], config.browsers);

  processors
    .processor("postcss-color-rebeccapurple")
    .embedded()
    .enableIfUnsupported(["css-rebeccapurple"], config.browsers);

  processors.processor("postcss-color-hwb").embedded();
  processors.processor("postcss-color-hsl").embedded();
  processors.processor("postcss-color-rgb").embedded();
  processors.processor("postcss-color-gray").embedded();

  processors
    .processor("postcss-color-hex-alpha")
    .embedded()
    .enableIfUnsupported(["css-rrggbbaa"], config.browsers);

  processors.processor("postcss-color-mod-function").embedded();

  processors.processor("postcss-font-family-system-ui").embedded();

  processors.processor("postcss-font-variant").embedded();

  processors
    .processor("pleeease-filters")
    .embedded()
    .enableIfUnsupported(["css-filters"], config.browsers);

  processors
    .processor("postcss-initial")
    .embedded()
    .enableIfUnsupported(["css-all", "css-initial-value"], config.browsers);

  processors
    .processor("pixrem")
    .embedded()
    .setOptions({ browsers: config.browsers })
    .enableIfUnsupported(["rem"], config.browsers);

  processors
    .processor("postcss-pseudoelements")
    .embedded()
    .enableIfUnsupported(["css-gencontent"], config.browsers);

  processors
    .processor("postcss-selector-matches")
    .embedded()
    .enableIfUnsupported(["css-matches-pseudo"], config.browsers);

  processors
    .processor("postcss-selector-not")
    .embedded()
    .enableIfUnsupported(["css-not-sel-list"], config.browsers);

  processors.processor("postcss-pseudo-class-any-link").embedded();

  processors
    .processor("postcss-color-rgba-fallback")
    .embedded()
    .enableIfUnsupported(["css3-colors"], config.browsers);

  processors
    .processor("postcss-replace-overflow-wrap")
    .embedded()
    .enableIfUnsupported(["wordwrap"], config.browsers);

  // Also support sass-style nesting
  processors.processor("postcss-nested").embedded();

  // Handle asset variables resolving
  processors
    .processor("postcss-assets")
    .embedded()
    .setOptions({
      cachebuster: true,
      loadPaths: ["images"],
      relative: true
    });

  // Options to apply to autoprefixer
  processors
    .processor("autoprefixer")
    .embedded()
    .setOptions({
      overrideBrowserslist: config.browsers
    });

  // CSSO :: Minify and Optimize CSS
  processors
    .processor("postcss-csso")
    .embedded()
    .enableIf(() => env === "production");

  // Report problems encountered during build
  processors
    .processor("postcss-reporter")
    .embedded()
    .setOptions({
      clearReportedMessages: true
    });

  // List the used plugins (sends output to debug)
  processors.processor("plugin-list").module("./postcss-plugin-list");

  return processors;
};
