const ChainedMap = require("./ChainedMap");
const Processor = require("./Processor");
const browserslist = require("@swissquote/crafty-commons/packages/browserslist");

class ProcessorMap extends ChainedMap {
  constructor(browsersQuery) {
    super();
    this.browsersQuery = browsersQuery;
  }

  getBrowsers = () => {
    if (!this.browsers) {
      this.browsers = browserslist(this.browsersQuery, {
        ignoreUnknownVersions: true
      });
    }

    return this.browsers;
  };

  /**
   * Create a processor, returns the existing one if there is already one with the same name
   *
   * @param {string} name The name of the module that provides this feature
   * @returns {Processor}
   */
  processor(name) {
    return this.getOrCompute(name, () => new Processor(name, this.getBrowsers));
  }
}

module.exports = function(config) {
  const env = config.environment || process.env.NODE_ENV || "production";

  // All processors used to make the CSS readable by a browser
  const processors = new ProcessorMap(config.browsers);

  // Handle @import and rebase urls
  processors.processor("postcss-import").embedded();
  processors
    .processor("postcss-url")
    .embedded()
    .setOptions({ url: "rebase" });

  // Apply Sass-like features
  processors
    .processor("postcss-advanced-variables")
    .embedded("knagis-postcss-advanced-variables")
    .setOptions({ disable: "@import" });
  processors.processor("postcss-atroot").embedded("swissquote-postcss-atroot");
  processors.processor("postcss-property-lookup").embedded();

  // Add plugins from postcss-preset-env missing in postcss-cssnext
  processors.processor("postcss-dir-pseudo-class").embedded();

  // Handle next generation features
  processors
    .processor("postcss-custom-properties")
    .embedded("swissquote-postcss-custom-properties")
    .enableIfUnsupported(["css-variables"])
    .setOptions({
      preserve: false,
      appendVariables: true
    });

  processors
    .processor("postcss-image-set-polyfill")
    .embedded("swissquote-postcss-image-set-polyfill")
    .enableIfUnsupported(["css-image-set"]);

  processors.processor("postcss-custom-selectors").embedded();

  processors
    .processor("postcss-attribute-case-insensitive")
    .embedded()
    .enableIfUnsupported(["css-case-insensitive"]);

  processors
    .processor("postcss-color-gray")
    .embedded("swissquote-postcss-color-gray");

  processors
    .processor("postcss-color-hwb")
    .embedded("swissquote-postcss-color-hwb");

  processors
    .processor("postcss-color-mod-function")
    .embedded("swissquote-postcss-color-mod-function");

  processors.processor("postcss-font-family-system-ui").embedded();

  processors.processor("postcss-font-variant").embedded();

  processors
    .processor("postcss-initial")
    .embedded()
    .enableIfUnsupported(["css-all", "css-initial-value"]);

  // Old Spec, syntax was changed to ":is()"
  processors
    .processor("postcss-selector-matches")
    .embedded("swissquote-postcss-selector-matches");

  processors.processor("postcss-pseudo-class-any-link").embedded();

  processors
    .processor("postcss-replace-overflow-wrap")
    .embedded()
    .enableIfUnsupported(["wordwrap"]);

  // Also support sass-style nesting
  processors.processor("postcss-nested").embedded();

  // Handle asset variables resolving
  processors
    .processor("postcss-assets")
    .embedded("swissquote-postcss-assets")
    .setOptions({
      cachebuster: true,
      loadPaths: ["images"],
      relative: true
    });

  // CSSO :: Minify and Optimize CSS
  processors
    .processor("postcss-parcel-css")
    .embedded()
    .setOptions({
      browsers: config.browsers,
      parcelCssOptions: {
        minify: env === "production",
        drafts: {
          customMedia: true
        }
      }
    });

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
